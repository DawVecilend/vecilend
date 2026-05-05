<?php

namespace App\Http\Controllers;

use App\Models\Objecte;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

class FavoriteController extends Controller
{
    /**
     * Marcar un objecte com a favorit.
     * POST /api/v1/objects/{id}/favorite
     */
    public function store(int $id): JsonResponse
    {
        $user = Auth::user();
        $object = Objecte::find($id);

        if (!$object) {
            return response()->json(['message' => 'Objecte no trobat'], 404);
        }

        // Evitar duplicats
        if ($user->favorits()->where('objecte_id', $id)->exists()) {
            return response()->json(['message' => 'Ja està als favorits'], 409);
        }

        $user->favorits()->attach($id);

        return response()->json([
            'message' => 'Afegit als favorits',
            'object_id' => $id,
        ], 201);
    }

    /**
     * Eliminar un objecte dels favorits.
     * DELETE /api/v1/objects/{id}/favorite
     */
    public function destroy(int $id): JsonResponse
    {
        $user = Auth::user();

        if (!$user->favorits()->where('objecte_id', $id)->exists()) {
            return response()->json(['message' => 'No estava als favorits'], 404);
        }

        $user->favorits()->detach($id);

        return response()->json([
            'message' => 'Eliminat dels favorits',
            'object_id' => $id,
        ], 200);
    }

    /**
     * Obtenir tots els favorits de l'usuari autenticat.
     * GET /api/v1/favorites
     */
    public function index(): JsonResponse
    {
        $user = Auth::user();
        $favorites = $user->favorits()
            ->with(['categoria', 'subcategoria', 'imatges', 'user:id,username,avatar_url'])
            ->get();

        return response()->json([
            'favorites' => $favorites,
            'total' => $favorites->count(),
        ], 200);
    }
}
