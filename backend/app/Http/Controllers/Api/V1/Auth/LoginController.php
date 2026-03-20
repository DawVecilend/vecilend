<?php

namespace App\Http\Controllers\Api\V1\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Resources\UserResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;

class LoginController extends Controller
{
    /**
     * POST /api/v1/login
     *
     * Valida credencials i retorna un Bearer token.
     */
    public function login(LoginRequest $request): JsonResponse
    {
        if (! Auth::attempt($request->validated())) {
            return response()->json([
                'message' => 'Credencials incorrectes.',
            ], 401);
        }

        /** @var \App\Models\User $user */
        $user = Auth::user();

        // Genera un token amb nom descriptiu
        // (Sanctum permet múltiples tokens per usuari — útil per multi-dispositiu)
        $token = $user->createToken(
            name: 'api-token',
            // Si en el futur voleu abilities/permisos:
            // abilities: ['objecte:crear', 'objecte:editar'],
        )->plainTextToken;

        return response()->json([
            'message' => 'Login correcte.',
            'data'    => [
                'user'  => new UserResource($user),
                'token' => $token,
            ],
        ], 200);
    }

    /**
     * POST /api/v1/logout
     *
     * Revoca el token actual (requereix auth:sanctum).
     */
    public function logout(Request $request): JsonResponse
    {
        // Elimina NOMÉS el token usat en aquesta petició
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Sessió tancada correctament.',
        ], 200);
    }
}
