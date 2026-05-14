<?php

namespace App\Http\Middleware;

use App\Models\User;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class LogUserAction
{
    public function handle(Request $request, Closure $next)
    {
        $response = $next($request);

        if (!in_array($request->method(), ['POST', 'PUT', 'PATCH', 'DELETE'], true)) {
            return $response;
        }

        $status = $response->getStatusCode();
        if ($status < 200 || $status >= 300) {
            return $response;
        }

        $user = $request->user();
        if (!$user instanceof User) {
            return $response;
        }

        DB::table('logs')->insert([
            'user_id'    => $user->id,
            'empleat_id' => null,
            'tipus'      => 'usuari',
            'accio'      => strtolower($request->method()) . ' ' . $request->path(),
            'detall'     => null,
            'entitat_afectada'    => null,
            'id_entitat_afectada' => null,
            'ip'         => $request->ip(),
            'created_at' => now(),
        ]);

        return $response;
    }
}
