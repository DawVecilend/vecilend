<?php

namespace App\Http\Controllers\Api\V1\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\Auth\LoginRequest;
use App\Http\Resources\UserResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use \App\Models\User;
use Illuminate\Http\Request;

class LoginController extends Controller
{
    public function login(LoginRequest $request): JsonResponse
    {
        $login = $request->input('login');
        $password = $request->input('password');

        $authenticated = Auth::guard('web')->attempt(['email' => $login, 'password' => $password, 'actiu' => true]) ||
            Auth::guard('web')->attempt(['username' => $login, 'password' => $password, 'actiu' => true]);

        if (!$authenticated) {
            // Comprovar si existeix però està inactiu
            $userExists = User::where('email', $login)
                ->orWhere('username', $login)
                ->where('actiu', false)
                ->exists();

            if ($userExists) {
                return response()->json([
                    'message' => 'Tu cuenta está desactivada. Contacta con soporte técnico.',
                ], 403);
            }

            return response()->json([
                'message' => 'Credenciales incorrectas.',
            ], 401);
        }

        /** @var \App\Models\User $user */
        $user = Auth::guard('web')->user();
        $token = $user->createToken('api-token')->plainTextToken;

        DB::table('logs')->insert([
            'user_id'    => $user->id,
            'empleat_id' => null,
            'tipus'      => 'auth',
            'accio'      => 'user_login',
            'detall'     => null,
            'entitat_afectada'    => null,
            'id_entitat_afectada' => null,
            'ip'         => $request->ip(),
            'created_at' => now(),
        ]);

        return response()->json([
            'message' => 'Login correcto.',
            'data'    => [
                'user'  => new UserResource($user),
                'token' => $token,
            ],
        ], 200);
    }

    public function logout(Request $request): JsonResponse
    {
        $user = $request->user();

        if ($user) {
            DB::table('logs')->insert([
                'user_id'    => $user->id,
                'empleat_id' => null,
                'tipus'      => 'auth',
                'accio'      => 'user_logout',
                'detall'     => null,
                'entitat_afectada'    => null,
                'id_entitat_afectada' => null,
                'ip'         => $request->ip(),
                'created_at' => now(),
            ]);
            $user->currentAccessToken()->delete();
        }

        return response()->json([
            'message' => 'Sesión cerrada correctamente.',
        ], 200);
    }
}
