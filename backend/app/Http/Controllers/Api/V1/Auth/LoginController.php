<?php

namespace App\Http\Controllers\Api\V1\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\Auth\LoginRequest;
use App\Http\Resources\UserResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use \App\Models\User;
use PragmaRX\Google2FA\Google2FA;

class LoginController extends Controller
{
    public function login(LoginRequest $request): JsonResponse
    {
        $login = $request->input('login');
        $password = $request->input('password');

        $user = User::where('email', $login)->orWhere('username', $login)->first();

        if (!$user || !Hash::check($password, $user->password)) {
            return response()->json([
                'message' => 'Credenciales incorrectas.',
            ], 401);
        }

        if (!$user->actiu) {
            return response()->json([
                'message' => 'Tu cuenta está desactivada. Contacta con soporte técnico.',
            ], 403);
        }

        Auth::guard('web')->setUser($user);

        if ($user->two_factor_enabled) {
            $challengeToken = Str::random(64);
            Cache::put('2fa:challenge:' . hash('sha256', $challengeToken), [
                'user_id'    => $user->id,
                'created_at' => now()->toIso8601String(),
            ], now()->addMinutes(5));

            return response()->json([
                'message'  => 'Se requiere autenticación de dos factores.',
                'data'     => [
                    'requires_2fa'       => true,
                    'two_factor_token'   => $challengeToken,
                ],
            ], 200);
        }

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

    public function verify2fa(Request $request): JsonResponse
    {
        $request->validate([
            'two_factor_token' => ['required', 'string'],
            'code'             => ['required', 'string'],
        ]);

        $cacheKey = '2fa:challenge:' . hash('sha256', $request->input('two_factor_token'));
        $payload = Cache::get($cacheKey);

        if (! $payload) {
            return response()->json([
                'message' => 'La sesión de verificación ha expirado. Vuelve a iniciar sesión.',
            ], 401);
        }

        $user = User::find($payload['user_id']);
        if (! $user || ! $user->actiu || ! $user->two_factor_enabled) {
            Cache::forget($cacheKey);
            return response()->json([
                'message' => 'No se puede completar la autenticación. Vuelve a iniciar sesión.',
            ], 401);
        }

        $code = $request->input('code');
        $google2fa = new Google2FA();

        $verified = false;
        if (strlen($code) === 6 && ctype_digit($code)) {
            $verified = $google2fa->verifyKey($user->two_factor_secret, $code);
        }

        $usedRecovery = false;
        if (! $verified) {
            $codes = $user->two_factor_recovery_codes ?? [];
            $normalized = strtoupper(trim($code));
            foreach ($codes as $i => $stored) {
                if (hash_equals(strtoupper($stored), $normalized)) {
                    array_splice($codes, $i, 1);
                    $user->forceFill(['two_factor_recovery_codes' => $codes])->save();
                    $verified = true;
                    $usedRecovery = true;
                    break;
                }
            }
        }

        if (! $verified) {
            return response()->json([
                'message' => 'El código no es válido.',
                'errors'  => ['code' => ['Código incorrecto.']],
            ], 422);
        }

        Cache::forget($cacheKey);

        $token = $user->createToken('api-token')->plainTextToken;

        DB::table('logs')->insert([
            'user_id'             => $user->id,
            'empleat_id'          => null,
            'tipus'               => 'auth',
            'accio'               => $usedRecovery ? 'user_login_2fa_recovery' : 'user_login_2fa',
            'detall'              => null,
            'entitat_afectada'    => null,
            'id_entitat_afectada' => null,
            'ip'                  => $request->ip(),
            'created_at'          => now(),
        ]);

        return response()->json([
            'message' => 'Login correcto.',
            'data'    => [
                'user'                  => new UserResource($user),
                'token'                 => $token,
                'recovery_codes_used'   => $usedRecovery,
                'recovery_codes_left'   => count($user->two_factor_recovery_codes ?? []),
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
