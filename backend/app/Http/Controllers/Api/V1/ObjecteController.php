<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\ObjecteResource;
use App\Http\Resources\ObjecteDetailResource;
use App\Models\Objecte;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ObjecteController extends Controller
{
    /**
     * GET /api/v1/objects?search=&category=&sort=&page=&per_page=&lat=&lng=&radius=
     *
     * Endpoint públic — llistat d'objectes disponibles amb filtres, cerca,
     * ordenació i paginació.
     */
    public function index(Request $request)
    {
        $request->validate([
            'search'   => 'nullable|string|max:100',
            'category' => 'nullable|integer|exists:categories,id',
            'sort'     => 'nullable|string|in:recent,oldest,price_asc,price_desc,rating',
            'page'     => 'nullable|integer|min:1',
            'per_page' => 'nullable|integer|min:1|max:50',
            'lat'      => 'nullable|numeric|between:-90,90',
            'lng'      => 'nullable|numeric|between:-180,180',
            'radius'   => 'nullable|integer|min:500|max:50000',
        ]);

        $query = Objecte::query()
            ->ambCoordenades()
            ->disponible()
            ->with(['user:id,nom,avatar_url', 'categoria:id,nom,icona', 'imatges']);

        if ($request->filled('search')) {
            $query->cerca($request->input('search'));
        }

        if ($request->filled('category')) {
            $query->perCategoria((int) $request->input('category'));
        }

        if ($request->filled('lat') && $request->filled('lng')) {
            $radius = (int) $request->input('radius', 5000);

            $query->aProximitat(
                (float) $request->input('lat'),
                (float) $request->input('lng'),
                $radius
            );
        }

        $sort = $request->input('sort', 'recent');

        switch ($sort) {
            case 'price_asc':
                $query->orderBy('preu_diari', 'asc');
                break;

            case 'price_desc':
                $query->orderBy('preu_diari', 'desc');
                break;

            case 'oldest':
                $query->orderBy('created_at', 'asc');
                break;

            case 'rating':
                $query->orderByDesc('created_at');
                break;

            case 'recent':
            default:
                $query->orderByDesc('created_at');
                break;
        }

        $perPage = (int) $request->input('per_page', 20);
        $objectes = $query->paginate($perPage);

        return ObjecteResource::collection($objectes);
    }

    /**
     * GET /api/v1/objects/{id}
     *
     * Retorna el detall complet d'un objecte: propietari, categoria,
     * subcategories, imatges, valoracions i dates ocupades.
     */
    public function show(int $id)
    {
        $objecte = Objecte::query()
            ->with([
                'user:id,nom,cognoms,avatar_url,created_at',
                'categoria:id,nom,icona',
                'subcategories:id,nom',
                'imatges',
            ])
            ->findOrFail($id);

        $objecte->user->valoracio_mitjana = $this->calcularValoracioPropietari($objecte->user_id);

        $stats = $this->obtenirEstadistiquesValoracio($id);
        $objecte->valoracio_mitjana = $stats->avg_rating;
        $objecte->total_valoracions = (int) $stats->count_ratings;

        $objecte->valoracions_data = $this->obtenirValoracionsObjecte($id);
        $objecte->dates_ocupades = $this->obtenirDatesOcupades($id);

        return new ObjecteDetailResource($objecte);
    }

    private function calcularValoracioPropietari(int $userId): ?float
    {
        $avg = DB::table('valoracions')
            ->join('transaccions', 'transaccions.id', '=', 'valoracions.transaccio_id')
            ->join('solicituds', 'solicituds.id', '=', 'transaccions.solicitud_id')
            ->join('objectes', 'objectes.id', '=', 'solicituds.objecte_id')
            ->where('objectes.user_id', $userId)
            ->avg('valoracions.puntuacio');

        return $avg !== null ? round((float) $avg, 1) : null;
    }

    private function obtenirEstadistiquesValoracio(int $objecteId): object
    {
        $result = DB::table('valoracions')
            ->join('transaccions', 'transaccions.id', '=', 'valoracions.transaccio_id')
            ->join('solicituds', 'solicituds.id', '=', 'transaccions.solicitud_id')
            ->where('solicituds.objecte_id', $objecteId)
            ->selectRaw('AVG(puntuacio) as avg_rating, COUNT(*) as count_ratings')
            ->first();

        return (object) [
            'avg_rating'    => $result->avg_rating !== null ? round((float) $result->avg_rating, 1) : null,
            'count_ratings' => $result->count_ratings ?? 0,
        ];
    }

    private function obtenirDatesOcupades(int $objecteId): array
    {
        return DB::table('solicituds')
            ->join('transaccions', 'transaccions.solicitud_id', '=', 'solicituds.id')
            ->where('solicituds.objecte_id', $objecteId)
            ->where('transaccions.estat', 'en_curs')
            ->select('solicituds.data_inici', 'solicituds.data_fi')
            ->orderBy('solicituds.data_inici')
            ->get()
            ->map(fn($row) => [
                'data_inici' => $row->data_inici,
                'data_fi'    => $row->data_fi,
            ])
            ->toArray();
    }

    private function obtenirValoracionsObjecte(int $objecteId): array
    {
        return DB::table('valoracions')
            ->join('transaccions', 'transaccions.id', '=', 'valoracions.transaccio_id')
            ->join('solicituds', 'solicituds.id', '=', 'transaccions.solicitud_id')
            ->join('users', 'users.id', '=', 'valoracions.autor_id')
            ->where('solicituds.objecte_id', $objecteId)
            ->select(
                'valoracions.id',
                'valoracions.puntuacio',
                'valoracions.comentari',
                'valoracions.created_at',
                'users.id as autor_id',
                'users.nom as autor_nom'
            )
            ->orderByDesc('valoracions.created_at')
            ->get()
            ->map(fn($row) => [
                'id'         => $row->id,
                'puntuacio'  => $row->puntuacio,
                'comentari'  => $row->comentari,
                'created_at' => $row->created_at,
                'autor'      => [
                    'id'  => $row->autor_id,
                    'nom' => $row->autor_nom,
                ],
            ])
            ->toArray();
    }
}
