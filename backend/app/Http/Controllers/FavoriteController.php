<?php

namespace App\Http\Controllers;

use App\Models\Objecte;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

class FavoriteController extends Controller
{
    /**
     * Obtenir tots els favorits de l'usuari autenticat.
     * GET /api/v1/favorites
     */
    public function index(): JsonResponse
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();

        // Carreguem TOTS els favorits per saber quants n'hi ha d'inactius (UI ho informa)
        $allFavorites = $user->favorits()
            ->with(['categoria', 'subcategoria', 'imatges', 'user:id,username,avatar_url'])
            ->get();

        // Però només mostrem els actualment disponibles. Els no_disponible
        // queden ocults sense esborrar-los de la BD: el dia que tornin a
        // estar disponibles, reapareixeran sols.
        $visible = $allFavorites->where('estat', 'disponible')->values();

        return response()->json([
            'favorites'      => $visible,
            'total'          => $visible->count(),
            'total_inactius' => $allFavorites->count() - $visible->count(),
        ], 200);
    }

    /**
     * Marcar un objecte com a favorit.
     * POST /api/v1/objects/{id}/favorite
     */
    public function store(int $id): JsonResponse
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();
        $object = Objecte::find($id);

        if (!$object) {
            return response()->json(['message' => 'Objeto no encontrado.'], 404);
        }

        // Evitar duplicats
        if ($user->favorits()->where('objecte_id', $id)->exists()) {
            return response()->json(['message' => 'Ya está en tus favoritos.'], 409);
        }

        $user->favorits()->attach($id);

        return response()->json([
            'message' => 'Añadido a favoritos.',
            'object_id' => $id,
        ], 201);
    }

    /**
     * Eliminar un objecte dels favorits.
     * DELETE /api/v1/objects/{id}/favorite
     */
    public function destroy(int $id): JsonResponse
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();

        if (!$user->favorits()->where('objecte_id', $id)->exists()) {
            return response()->json(['message' => 'No estaba en tus favoritos.'], 404);
        }

        $user->favorits()->detach($id);

        return response()->json([
            'message' => 'Eliminado de favoritos.',
            'object_id' => $id,
        ], 200);
    }
}
