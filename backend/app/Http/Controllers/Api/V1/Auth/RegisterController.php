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
use App\Http\Controllers\Api\V1\Auth\EmailVerificationController;

class RegisterController extends Controller
{
    public function register(RegisterRequest $request, CloudinaryService $cloudinary): JsonResponse
    {
        $validated = $request->validated();
        // Bloquejar el registre si l'email no s'ha verificat amb el codi previ
        if (! EmailVerificationController::isEmailVerified($validated['email'])) {
            return response()->json([
                'message' => 'Tienes que verificar tu email con el código antes de completar el registro.',
                'errors'  => [
                    'email' => ["El email no está verificado. Solicita un código nuevo desde el paso 2."],
                ],
            ], 422);
        }
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
                    'rol'              => 'usuari',
                    'actiu'            => true,
                    'email_verified_at' => now(),
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

        EmailVerificationController::clearVerifiedFlag($validated['email']);

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
