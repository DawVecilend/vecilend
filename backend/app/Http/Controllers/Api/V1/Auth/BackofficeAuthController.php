<?php

namespace App\Http\Controllers\Api\V1\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\Auth\BackofficeLoginRequest;
use App\Http\Resources\EmpleatResource;
use App\Models\Empleat;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class BackofficeAuthController extends Controller
{
    public function login(BackofficeLoginRequest $request): JsonResponse
    {
        $login    = $request->input('login');
        $password = $request->input('password');

        $empleat = Empleat::where('email', $login)
            ->orWhere('username', $login)
            ->first();

        if (!$empleat || !Hash::check($password, $empleat->password)) {
            return response()->json([
                'message' => 'Credenciales incorrectas.',
            ], 401);
        }

        if (!$empleat->actiu) {
            return response()->json([
                'message' => 'Esta cuenta está desactivada. Contacta con un administrador.',
            ], 403);
        }

        $token = $empleat->createToken('backoffice-token')->plainTextToken;

        $this->logBackofficeAction($empleat, 'login', $request);

        return response()->json([
            'message' => 'Login correcte.',
            'data'    => [
                'empleat' => new EmpleatResource($empleat),
                'token'   => $token,
            ],
        ], 200);
    }

    public function me(Request $request): JsonResponse
    {
        $empleat = $request->user();
        return response()->json([
            'data' => new EmpleatResource($empleat),
        ]);
    }

    public function logout(Request $request): JsonResponse
    {
        $empleat = $request->user();

        if ($empleat) {
            $this->logBackofficeAction($empleat, 'logout', $request);
            $empleat->currentAccessToken()->delete();
        }

        return response()->json([
            'message' => 'Sesión cerrada correctamente.',
        ], 200);
    }

    protected function logBackofficeAction(Empleat $empleat, string $action, Request $request): void
    {
        DB::table('logs')->insert([
            'user_id'    => null,
            'empleat_id' => $empleat->id,
            'tipus'      => 'auth',
            'accio'      => "empleat_{$action}",
            'detall'     => null,
            'entitat_afectada'    => null,
            'id_entitat_afectada' => null,
            'ip'         => $request->ip(),
            'created_at' => now(),
        ]);
    }
}
