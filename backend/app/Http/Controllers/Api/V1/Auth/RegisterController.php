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

class RegisterController extends Controller {
    public function register(RegisterRequest $request, CloudinaryService $cloudinary): JsonResponse {
        $validated = $request->validated();
        $avatarUrl = null;
        $avatarPublicId = null;

        if ($request->hasFile('avatar')) {
            try {
                $result = $cloudinary->upload(
                    $request->file('avatar'),
                    'vecilend/avatars'
                );
                $avatarUrl      = $result['url'];
                $avatarPublicId = $result['public_id'];
            } catch (\Throwable $e) {
                return response()->json([
                    'message' => $e->getMessage(),
                ], 500);
            }
        }

        $user = User::create([
            'username' => $validated['username'],
            'nom' => $validated['nom'],
            'cognoms' => $validated['cognoms'],
            'email' => $validated['email'],
            'password' => $validated['password'],
            'biography' => $validated['biography'] ?? null,
            'telefon' => $validated['telefon'] ?? null,
            'direccio' => $validated['direccio'] ?? null,
            'avatar_url' => $avatarUrl,
            'avatar_public_id' => $avatarPublicId,
            'radi_proximitat' => $validated['radi_proximitat'] ?? 5,
            'rol' => 'usuari',
            'actiu' => true,
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
        
        $token = $user->createToken('auth')->plainTextToken;
        return response()->json([
            'data' => new UserResource($user),
            'token' => $token,
        ], 201);
    }

    public function checkUser(CheckUserRequest $request): JsonResponse {
        $emailExists = User::where('email', $request->email)->exists();
        $userExists = User::where('username', $request->username)->exists();

        return response()->json([
            'emailExists' => $emailExists,
            'userExists' => $userExists,
        ]);
    }
}