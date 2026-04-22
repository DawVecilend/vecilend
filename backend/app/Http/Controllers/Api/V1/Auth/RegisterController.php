<?php

namespace App\Http\Controllers\Api\V1\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\Auth\RegisterRequest;
use App\Http\Requests\Api\V1\Auth\CheckUserRequest;
use App\Services\CloudinaryService;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class RegisterController extends Controller
{
    public function register(RegisterRequest $request, CloudinaryService $cloudinary): JsonResponse
{
    $validated = $request->validated();

    // ── 1. Pujar avatar (fora de la transacció, abans) ──
    $avatarUrl = null;
    $avatarPublicId = null;

    if ($request->hasFile('avatar')) {
        try {
            $result = $cloudinary->upload($request->file('avatar'), 'vecilend/avatars');
            $avatarUrl      = $result['url'];
            $avatarPublicId = $result['public_id'];
        } catch (\Throwable $e) {
            return response()->json(['message' => 'Error pujant l&apos;avatar.'], 500);
        }
    }

    // ── 2. Transacció: crear usuari + ubicació PostGIS ──
    try {
        $user = DB::transaction(function () use ($validated, $avatarUrl, $avatarPublicId) {
            $user = User::create([
                'username'         => $validated['username'],
                'nom'              => $validated['nom'],
                'cognoms'          => $validated['cognoms'],
                'email'            => $validated['email'],
                'password'         => $validated['password'],
                'biography'        => $validated['biography'] ?? null,
                'telefon'          => $validated['telefon'] ?? null,
                'direccio'         => $validated['direccio'] ?? null,
                'avatar_url'       => $avatarUrl,
                'avatar_public_id' => $avatarPublicId,
                'radi_proximitat'  => $validated['radi_proximitat'] ?? 5,
                'rol'              => 'usuari',
                'actiu'            => true,
            ]);

            if (isset($validated['ubicacio'])) {
                $lat = $validated['ubicacio']['lat'];
                $lng = $validated['ubicacio']['lng'];
                DB::statement(
                    'UPDATE users SET ubicacio = ST_SetSRID(ST_MakePoint(?, ?), 4326)::geography WHERE id = ?',
                    [$lng, $lat, $user->id]
                );
                $user->refresh();
            }

            return $user;
        });
    } catch (\Throwable $e) {
        // Rollback de Cloudinary si la BD ha fallat
        if ($avatarPublicId) {
            try {
                $cloudinary->delete($avatarPublicId);
            } catch (\Throwable $cloudErr) {
                Log::warning('Cloudinary rollback failed on register', [
                    'public_id' => $avatarPublicId,
                    'error'     => $cloudErr->getMessage(),
                ]);
            }
        }
        return response()->json(['message' => 'Error en el registre.'], 500);
    }

    // ── 3. Token i resposta ──
    $token = $user->createToken('auth')->plainTextToken;

    return response()->json([
        'message' => 'Registre completat correctament.',
        'data'    => [
            'user'  => new UserResource($user),
            'token' => $token,
        ],
    ], 201);
}

    public function checkUser(CheckUserRequest $request): JsonResponse
    {
        $emailExists = User::where('email', $request->email)->exists();
        $userExists = User::where('username', $request->username)->exists();

        return response()->json([
            'emailExists' => $emailExists,
            'userExists' => $userExists,
        ]);
    }
}
