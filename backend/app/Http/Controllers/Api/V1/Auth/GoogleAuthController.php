<?php

namespace App\Http\Controllers\Api\V1\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Laravel\Socialite\Facades\Socialite;
use Throwable;

class GoogleAuthController extends Controller
{
    public function redirect(): RedirectResponse
    {
        return Socialite::driver('google')
            ->stateless()
            ->scopes(['openid', 'profile', 'email'])
            ->redirect();
    }

    public function callback(Request $request): RedirectResponse
    {
        $frontendUrl = rtrim(config('app.frontend_url'), '/');

        if ($request->has('error')) {
            return redirect()->away($frontendUrl . '/auth/google/callback?error=' . urlencode((string) $request->input('error')));
        }

        try {
            $googleUser = Socialite::driver('google')->stateless()->user();
        } catch (Throwable $e) {
            Log::warning('Google OAuth callback failed', ['error' => $e->getMessage()]);
            return redirect()->away($frontendUrl . '/auth/google/callback?error=oauth_failed');
        }

        $email = $googleUser->getEmail();
        if (! $email) {
            return redirect()->away($frontendUrl . '/auth/google/callback?error=no_email');
        }

        try {
            $user = DB::transaction(function () use ($googleUser, $email) {
                $existing = User::where('google_id', $googleUser->getId())
                    ->orWhere('email', $email)
                    ->first();

                if ($existing) {
                    $updates = [];
                    if (empty($existing->google_id)) {
                        $updates['google_id'] = $googleUser->getId();
                    }
                    if (empty($existing->email_verified_at)) {
                        $updates['email_verified_at'] = now();
                    }
                    if (empty($existing->avatar_url) && $googleUser->getAvatar()) {
                        $updates['avatar_url'] = $googleUser->getAvatar();
                    }
                    if (! empty($updates)) {
                        $existing->forceFill($updates)->save();
                    }
                    return $existing;
                }

                $raw = $googleUser->user ?? [];
                $given = $raw['given_name'] ?? null;
                $family = $raw['family_name'] ?? null;
                $fullName = $googleUser->getName() ?? '';

                if (! $given && $fullName) {
                    $parts = preg_split('/\s+/', trim($fullName));
                    $given = $parts[0] ?? 'Usuario';
                    if (! $family && count($parts) > 1) {
                        $family = trim(implode(' ', array_slice($parts, 1)));
                    }
                }

                $nom = $given ?: 'Usuario';
                $cognoms = $family ?: '-';

                $username = $this->generateUniqueUsername($email);

                return User::create([
                    'username'          => $username,
                    'nom'               => Str::limit($nom, 100, ''),
                    'cognoms'           => Str::limit($cognoms, 150, ''),
                    'email'             => $email,
                    'password'          => null,
                    'avatar_url'        => $googleUser->getAvatar(),
                    'google_id'         => $googleUser->getId(),
                    'email_verified_at' => now(),
                    'actiu'             => true,
                ]);
            });
        } catch (Throwable $e) {
            Log::error('Google OAuth user provisioning failed', ['error' => $e->getMessage()]);
            return redirect()->away($frontendUrl . '/auth/google/callback?error=provisioning_failed');
        }

        if (! $user->actiu) {
            return redirect()->away($frontendUrl . '/auth/google/callback?error=account_disabled');
        }

        $code = bin2hex(random_bytes(32));
        Cache::put('oauth_code:' . $code, $user->id, now()->addSeconds(60));

        DB::table('logs')->insert([
            'user_id'             => $user->id,
            'empleat_id'          => null,
            'tipus'               => 'auth',
            'accio'               => 'user_login_google',
            'detall'              => null,
            'entitat_afectada'    => null,
            'id_entitat_afectada' => null,
            'ip'                  => $request->ip(),
            'created_at'          => now(),
        ]);

        return redirect()->away($frontendUrl . '/auth/google/callback?code=' . urlencode($code));
    }

    public function exchange(Request $request): JsonResponse
    {
        $code = (string) $request->input('code', '');
        if ($code === '' || strlen($code) > 128) {
            return response()->json(['message' => 'Código inválido.'], 422);
        }

        $userId = Cache::pull('oauth_code:' . $code);
        if (! $userId) {
            return response()->json(['message' => 'Código inválido o expirado.'], 401);
        }

        $user = User::find($userId);
        if (! $user || ! $user->actiu) {
            return response()->json(['message' => 'Cuenta no disponible.'], 401);
        }

        $token = $user->createToken('google-oauth')->plainTextToken;

        return response()->json([
            'data' => [
                'user'  => new \App\Http\Resources\UserResource($user),
                'token' => $token,
            ],
        ]);
    }

    private function generateUniqueUsername(string $email): string
    {
        $local = strtolower((string) Str::before($email, '@'));
        $base = preg_replace('/[^a-z0-9._-]/', '', $local);
        if ($base === '' || $base === null) {
            $base = 'user';
        }
        $base = substr($base, 0, 90);

        if ($base === 'admin' || $base === 'vecilend') {
            $base = $base . Str::lower(Str::random(4));
        }

        $username = $base;
        $i = 1;
        while (User::where('username', $username)->exists()) {
            $suffix = (string) $i;
            $username = substr($base, 0, 100 - strlen($suffix)) . $suffix;
            $i++;
            if ($i > 9999) {
                $username = $base . Str::lower(Str::random(6));
                break;
            }
        }

        return $username;
    }
}
