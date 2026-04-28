<?php

namespace App\Http\Controllers\Api\V1\Auth;

use App\Http\Controllers\Controller;
use App\Mail\VerificationCodeMail;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;

class EmailVerificationController extends Controller
{
    private const CACHE_PREFIX_CODE     = 'email_verification:code:';
    private const CACHE_PREFIX_VERIFIED = 'email_verification:verified:';
    private const CODE_TTL_MINUTES      = 10;
    private const VERIFIED_TTL_MINUTES  = 30;

    /**
     * POST /api/v1/email/send-code
     * Body: { "email": "...", "nom"?: "..." }
     *
     * Genera un codi de 6 dígits, el guarda al cache i l'envia per email.
     * Sempre retorna 200, fins i tot si Mailtrap falla, perquè el frontend
     * no es bloquegi (l'usuari pot demanar reenviar el codi).
     */
    public function sendCode(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'email' => ['required', 'email', 'max:255'],
            'nom'   => ['nullable', 'string', 'max:100'],
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Dades invàlides.',
                'errors'  => $validator->errors(),
            ], 422);
        }

        $email = strtolower($request->input('email'));

        // Evitar spam - limitar 1 codi cada 60s per email
        $rateKey = 'email_verification:rate:' . $email;
        if (Cache::has($rateKey)) {
            return response()->json([
                'message' => 'Espera uns segons abans de demanar un altre codi.',
            ], 429);
        }
        Cache::put($rateKey, true, now()->addMinute());

        $code = str_pad((string) random_int(0, 999999), 6, '0', STR_PAD_LEFT);

        Cache::put(
            self::CACHE_PREFIX_CODE . $email,
            $code,
            now()->addMinutes(self::CODE_TTL_MINUTES)
        );

        try {
            Mail::to($email)->send(new VerificationCodeMail($code, $request->input('nom')));
        } catch (\Throwable $e) {
            Log::error('Error enviant codi de verificació', [
                'email' => $email,
                'error' => $e->getMessage(),
            ]);
            return response()->json([
                'message' => "No s'ha pogut enviar el correu. Torna-ho a provar en uns segons.",
            ], 500);
        }

        return response()->json([
            'message'         => 'Codi enviat. Revisa el correu.',
            'expires_minutes' => self::CODE_TTL_MINUTES,
        ], 200);
    }

    /**
     * POST /api/v1/email/verify-code
     * Body: { "email": "...", "code": "123456" }
     *
     * Valida el codi contra el cache. Si és correcte, marca un flag de verificat
     * al cache (TTL 30 min) que el RegisterController llegirà al crear l'usuari.
     */
    public function verifyCode(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'email' => ['required', 'email', 'max:255'],
            'code'  => ['required', 'string', 'size:6'],
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Dades invàlides.',
                'errors'  => $validator->errors(),
            ], 422);
        }

        $email = strtolower($request->input('email'));
        $code  = $request->input('code');

        $stored = Cache::get(self::CACHE_PREFIX_CODE . $email);

        if (!$stored || !hash_equals((string) $stored, (string) $code)) {
            return response()->json([
                'message' => 'Codi incorrecte o caducat.',
            ], 422);
        }

        Cache::forget(self::CACHE_PREFIX_CODE . $email);
        Cache::put(
            self::CACHE_PREFIX_VERIFIED . $email,
            true,
            now()->addMinutes(self::VERIFIED_TTL_MINUTES)
        );

        return response()->json([
            'message'  => 'Email verificat correctament.',
            'verified' => true,
        ], 200);
    }

    /**
     * Helper estàtic perquè RegisterController pugui consultar
     * si l'email s'ha verificat dins els darrers 30 minuts.
     */
    public static function isEmailVerified(string $email): bool
    {
        return (bool) Cache::get(self::CACHE_PREFIX_VERIFIED . strtolower($email));
    }

    /**
     * Helper estàtic per netejar el flag després de crear l'usuari.
     */
    public static function clearVerifiedFlag(string $email): void
    {
        Cache::forget(self::CACHE_PREFIX_VERIFIED . strtolower($email));
    }
}
