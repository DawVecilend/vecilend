<?php

namespace App\Http\Controllers\Api\V1\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use PragmaRX\Google2FA\Google2FA;

class TwoFactorController extends Controller
{
    private Google2FA $google2fa;

    public function __construct()
    {
        $this->google2fa = new Google2FA();
    }

    public function setup(Request $request): JsonResponse
    {
        $user = $request->user();

        if ($user->two_factor_enabled) {
            return response()->json([
                'message' => 'La autenticación de dos factores ya está activada.',
            ], 409);
        }

        $secret = $this->google2fa->generateSecretKey();
        $recoveryCodes = $this->generateRecoveryCodes();

        $user->forceFill([
            'two_factor_secret'         => $secret,
            'two_factor_recovery_codes' => $recoveryCodes,
            'two_factor_enabled'        => false,
            'two_factor_confirmed_at'   => null,
        ])->save();

        $otpauthUrl = $this->google2fa->getQRCodeUrl(
            'Vecilend',
            $user->email,
            $secret
        );

        return response()->json([
            'data' => [
                'secret'         => $secret,
                'otpauth_url'    => $otpauthUrl,
                'recovery_codes' => $recoveryCodes,
            ],
        ]);
    }

    public function confirm(Request $request): JsonResponse
    {
        $request->validate([
            'code' => ['required', 'string', 'size:6'],
        ]);

        $user = $request->user();

        if ($user->two_factor_enabled) {
            return response()->json([
                'message' => 'La autenticación de dos factores ya está activada.',
            ], 409);
        }

        if (! $user->two_factor_secret) {
            return response()->json([
                'message' => 'Tienes que iniciar la configuración del 2FA primero.',
            ], 422);
        }

        $valid = $this->google2fa->verifyKey($user->two_factor_secret, $request->input('code'));
        if (! $valid) {
            return response()->json([
                'message' => 'El código no es válido. Vuelve a intentarlo.',
                'errors'  => ['code' => ['Código incorrecto.']],
            ], 422);
        }

        $user->forceFill([
            'two_factor_enabled'      => true,
            'two_factor_confirmed_at' => now(),
        ])->save();

        DB::table('logs')->insert([
            'user_id'             => $user->id,
            'empleat_id'          => null,
            'tipus'               => 'auth',
            'accio'               => 'user_2fa_enabled',
            'detall'              => null,
            'entitat_afectada'    => null,
            'id_entitat_afectada' => null,
            'ip'                  => $request->ip(),
            'created_at'          => now(),
        ]);

        return response()->json([
            'message' => 'Autenticación de dos factores activada correctamente.',
        ]);
    }

    public function disable(Request $request): JsonResponse
    {
        $user = $request->user();

        if (! $user->two_factor_enabled) {
            return response()->json([
                'message' => 'La autenticación de dos factores no está activada.',
            ], 409);
        }

        $hasPassword = ! is_null($user->password);

        $rules = ['code' => ['required', 'string']];
        if ($hasPassword) {
            $rules['password'] = ['required', 'string'];
        }
        $request->validate($rules);

        if ($hasPassword && ! Hash::check($request->input('password'), $user->password)) {
            return response()->json([
                'message' => 'La contraseña no es correcta.',
                'errors'  => ['password' => ['Contraseña incorrecta.']],
            ], 422);
        }

        if (! $this->verifyTotpOrRecovery($user, $request->input('code'))) {
            return response()->json([
                'message' => 'El código no es válido.',
                'errors'  => ['code' => ['Código incorrecto.']],
            ], 422);
        }

        $user->forceFill([
            'two_factor_enabled'        => false,
            'two_factor_secret'         => null,
            'two_factor_recovery_codes' => null,
            'two_factor_confirmed_at'   => null,
        ])->save();

        DB::table('logs')->insert([
            'user_id'             => $user->id,
            'empleat_id'          => null,
            'tipus'               => 'auth',
            'accio'               => 'user_2fa_disabled',
            'detall'              => null,
            'entitat_afectada'    => null,
            'id_entitat_afectada' => null,
            'ip'                  => $request->ip(),
            'created_at'          => now(),
        ]);

        return response()->json([
            'message' => 'Autenticación de dos factores desactivada.',
        ]);
    }

    public function showRecoveryCodes(Request $request): JsonResponse
    {
        $user = $request->user();

        if (! $user->two_factor_enabled) {
            return response()->json([
                'message' => 'La autenticación de dos factores no está activada.',
            ], 409);
        }

        $hasPassword = ! is_null($user->password);

        $rules = ['code' => ['required', 'string']];
        if ($hasPassword) {
            $rules['password'] = ['required', 'string'];
        }
        $request->validate($rules);

        if ($hasPassword && ! Hash::check($request->input('password'), $user->password)) {
            return response()->json([
                'message' => 'La contraseña no es correcta.',
                'errors'  => ['password' => ['Contraseña incorrecta.']],
            ], 422);
        }

        if (! $this->google2fa->verifyKey($user->two_factor_secret, $request->input('code'))) {
            return response()->json([
                'message' => 'El código no es válido.',
                'errors'  => ['code' => ['Código incorrecto.']],
            ], 422);
        }

        return response()->json([
            'data' => [
                'recovery_codes' => $user->two_factor_recovery_codes ?? [],
            ],
        ]);
    }

    public function regenerateRecoveryCodes(Request $request): JsonResponse
    {
        $user = $request->user();

        if (! $user->two_factor_enabled) {
            return response()->json([
                'message' => 'La autenticación de dos factores no está activada.',
            ], 409);
        }

        $hasPassword = ! is_null($user->password);

        $rules = ['code' => ['required', 'string']];
        if ($hasPassword) {
            $rules['password'] = ['required', 'string'];
        }
        $request->validate($rules);

        if ($hasPassword && ! Hash::check($request->input('password'), $user->password)) {
            return response()->json([
                'message' => 'La contraseña no es correcta.',
                'errors'  => ['password' => ['Contraseña incorrecta.']],
            ], 422);
        }

        if (! $this->google2fa->verifyKey($user->two_factor_secret, $request->input('code'))) {
            return response()->json([
                'message' => 'El código no es válido.',
                'errors'  => ['code' => ['Código incorrecto.']],
            ], 422);
        }

        $newCodes = $this->generateRecoveryCodes();
        $user->forceFill(['two_factor_recovery_codes' => $newCodes])->save();

        return response()->json([
            'data' => [
                'recovery_codes' => $newCodes,
            ],
        ]);
    }

    private function verifyTotpOrRecovery($user, string $code): bool
    {
        if (strlen($code) === 6 && ctype_digit($code)) {
            return $this->google2fa->verifyKey($user->two_factor_secret, $code);
        }

        $codes = $user->two_factor_recovery_codes ?? [];
        $normalized = strtoupper(trim($code));
        foreach ($codes as $i => $stored) {
            if (hash_equals(strtoupper($stored), $normalized)) {
                array_splice($codes, $i, 1);
                $user->forceFill(['two_factor_recovery_codes' => $codes])->save();
                return true;
            }
        }
        return false;
    }

    private function generateRecoveryCodes(): array
    {
        $codes = [];
        for ($i = 0; $i < 10; $i++) {
            $codes[] = strtoupper(Str::random(5)) . '-' . strtoupper(Str::random(5));
        }
        return $codes;
    }
}
