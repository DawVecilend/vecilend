<?php

namespace App\Http\Controllers\Api\V1\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\Auth\ForgotPasswordRequest;
use App\Http\Requests\Api\V1\Auth\ResetPasswordRequest;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Str;

class PasswordResetController extends Controller
{
    /**
     * POST /api/v1/forgot-password
     *
     * Envia un email amb el link de reset.
     * Sempre retorna 200 per no revelar si l'email existeix (anti-enumeració).
     */
    public function forgotPassword(ForgotPasswordRequest $request): JsonResponse
    {
        Password::sendResetLink(
            $request->only('email')
        );

        // Sempre retornem el mateix missatge, independentment de si l'email
        // existeix a la BD. Això prevé l'enumeració d'usuaris.
        return response()->json([
            'message' => "Si l'adreça existeix, rebràs un email amb les instruccions.",
        ]);
    }

    /**
     * POST /api/v1/reset-password
     *
     * Valida el token i canvia la contrasenya.
     */
    public function resetPassword(ResetPasswordRequest $request): JsonResponse
    {
        $status = Password::reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            function ($user, string $password) {
                $user->forceFill([
                    'password'       => Hash::make($password),
                    'remember_token' => Str::random(60),
                ])->save();

                // Revocar TOTS els tokens Sanctum existents per seguretat.
                // L'usuari haurà de fer login de nou.
                $user->tokens()->delete();

                event(new PasswordReset($user));
            }
        );

        if ($status === Password::PASSWORD_RESET) {
            return response()->json([
                'message' => 'Contrasenya actualitzada correctament.',
            ]);
        }

        return response()->json([
            'message' => "No s'ha pogut restablir la contrasenya.",
            'errors'  => [
                'email' => [__($status)],
            ],
        ], 422);
    }
}
