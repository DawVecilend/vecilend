<?php

namespace App\Http\Controllers\Api\V1\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\Auth\RegisterRequest;
use App\Http\Requests\Api\V1\Auth\CheckUserRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class RegisterController extends Controller {
    public function register(RegisterRequest $request): JsonResponse {
        $validated = $request->validated();
        $user = User::create([
            'username' => $validated['username'],
            'nom' => $validated['nom'],
            'cognoms' => $validated['cognoms'],
            'email' => $validated['email'],
            'password' => $validated['password'],
            'telefon' => $validated['telefon'] ?? null,
            'direccio' => $validated['direccio'] ?? null,
            'avatar_url' => $validated['avatar_url'] ?? null,
            'radi_proximitat' => $validated['radi_proximitat'] ?? 5,
            'rol' => 'usuari',
            'actiu' => true,
        ]);

        if (isset($validated['ubicacio'])) {
            $lat = $validated['ubicacio']['lat'];
            $lng = $validated['ubicacio']['lng'];
            DB::statement(
                'UPDATE users SET ubicacio = ST_SetSRID(ST_MakePoint(?,
                ?), 4326) WHERE id = ?',
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