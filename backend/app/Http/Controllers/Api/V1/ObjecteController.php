<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\ObjecteResource;
use App\Http\Resources\ObjecteDetailResource;
use App\Models\Objecte;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Services\CloudinaryService;
use App\Models\ImatgeObjecte;

class ObjecteController extends Controller {
    public function index(Request $request) {
        $request->validate([
            'search'   => 'nullable|string|max:100',
            'category' => 'nullable|integer|exists:categories,id',
            'sort'     => 'nullable|string|in:recent,price_asc,price_desc,rating',
            'page'     => 'nullable|integer|min:1',
            'per_page' => 'nullable|integer|min:1|max:50',
            'lat'      => 'nullable|numeric|between:-90,90',
            'lng'      => 'nullable|numeric|between:-180,180',
            'radius'   => 'nullable|integer|min:500|max:50000',
        ]);

        $query = Objecte::query()->disponible()->with(['user:id,nom,avatar_url', 'categoria:id,nom,icona', 'imatges']);

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

        // ── Valoració mitjana del propietari ──
        $objecte->user->valoracio_mitjana = $this->calcularValoracioPropietari($objecte->user_id);

        // ── Estadístiques de valoració de l'objecte ──
        $stats = $this->obtenirEstadistiquesValoracio($id);
        $objecte->valoracio_mitjana = $stats->avg_rating;
        $objecte->total_valoracions = (int) $stats->count_ratings;

        // ── Valoracions amb autor ──
        $objecte->valoracions_data = $this->obtenirValoracionsObjecte($id);

        // ── Dates ocupades (transaccions actives) ──
        $objecte->dates_ocupades = $this->obtenirDatesOcupades($id);

        return new ObjecteDetailResource($objecte);
    }

    // ──────────────────────────────────────
    //  MÈTODES PRIVATS (detall)
    // ──────────────────────────────────────

    /**
     * Calcula la valoració mitjana del propietari a través de
     * totes les transaccions dels seus objectes.
     */
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

    /**
     * Obté la mitjana i el total de valoracions d'un objecte.
     */
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

    /**
     * Retorna les dates ocupades per un objecte (sol·licituds acceptades
     * amb transaccions actives o en curs).
     */
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

    /**
     * Obté les valoracions de l'objecte amb l'autor de cada una.
     */
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
                'id'        => $row->id,
                'puntuacio' => $row->puntuacio,
                'comentari' => $row->comentari,
                'created_at' => $row->created_at,
                'autor'     => [
                    'id'  => $row->autor_id,
                    'nom' => $row->autor_nom,
                ],
            ])
            ->toArray();
    
    private function processarImatges(array $files, int $objecteId, CloudinaryService $cloudinary): void {
        foreach ($files as $index => $file) {
            $result = $cloudinary->uploadObjecteImage($file, $objecteId);
            ImatgeObjecte::create([
                'objecte_id' => $objecteId,
                'url_cloudinary' => $result['url'],
                'public_id_cloudinary' => $result['public_id'],
                'ordre' => $index,
            ]);
        }
    }
    
    private function eliminarImatges(int $objecteId, CloudinaryService $cloudinary): void {
        $imatges = ImatgeObjecte::where('objecte_id', $objecteId)->get();
        $publicIds = $imatges->pluck('public_id_cloudinary')->toArray();
        $cloudinary->deleteMultiple($publicIds);
        ImatgeObjecte::where('objecte_id', $objecteId)->delete();
    }
}
