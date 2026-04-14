<?php

namespace App\Http\Controllers\Api\V1\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\Auth\LoginRequest;
use App\Http\Resources\UserResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use \App\Models\User;
use Illuminate\Http\Request;

class LoginController extends Controller
{
    public function login(LoginRequest $request): JsonResponse
    {
        $login = $request->input('login');
        $password = $request->input('password');

        $authenticated = Auth::attempt(['email' => $login, 'password' => $password]) ||
                     Auth::attempt(['username' => $login, 'password' => $password]);

        if (!$authenticated) {
            return response()->json([
                'message' => 'Credencials incorrectes.',
            ], 401);
        }

        $user = Auth::user();
        $token = $user->createToken(name: 'api-token')->plainTextToken;

        return response()->json([
            'message' => 'Login correcte.',
            'data'    => [
                'user'  => new UserResource($user),
                'token' => $token,
            ],
        ], 200);
    }

    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Sessió tancada correctament.',
        ], 200);
    }
}
