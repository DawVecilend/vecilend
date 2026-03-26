<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\ObjecteResource;
use App\Models\Objecte;
use Illuminate\Http\Request;

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
            'sort'     => 'nullable|string|in:recent,price_asc,price_desc,rating',
            'page'     => 'nullable|integer|min:1',
            'per_page' => 'nullable|integer|min:1|max:50',
            'lat'      => 'nullable|numeric|between:-90,90',
            'lng'      => 'nullable|numeric|between:-180,180',
            'radius'   => 'nullable|integer|min:500|max:50000', // metres
        ]);

        $query = Objecte::query()
            // ── Només objectes disponibles ──
            ->disponible()
            // ── Eager load relacions ──
            ->with(['user:id,nom,avatar_url', 'categoria:id,nom,icona', 'imatges']);

        // ── Filtre: cerca per text ──
        if ($request->filled('search')) {
            $query->cerca($request->input('search'));
        }

        // ── Filtre: categoria ──
        if ($request->filled('category')) {
            $query->perCategoria((int) $request->input('category'));
        }

        // ── Filtre: proximitat geoespacial ──
        if ($request->filled('lat') && $request->filled('lng')) {
            $radius = (int) $request->input('radius', 5000); // per defecte 5 km
            $query->aProximitat(
                (float) $request->input('lat'),
                (float) $request->input('lng'),
                $radius
            );
        }

        // ── Ordenació ──
        $sort = $request->input('sort', 'recent');

        switch ($sort) {
            case 'price_asc':
                $query->orderBy('preu_diari', 'asc');
                break;

            case 'price_desc':
                $query->orderBy('preu_diari', 'desc');
                break;

            case 'rating':
                // TODO: implementar quan existeixin models Transaccio + Valoracio
                $query->orderByDesc('created_at');
                break;

            case 'recent':
            default:
                $query->orderByDesc('created_at');
                break;
        }

        // ── Paginació ──
        $perPage = (int) $request->input('per_page', 20);
        $objectes = $query->paginate($perPage);

        return ObjecteResource::collection($objectes);
    }
}
