<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class EnsureAdminRole
{
    public function handle(Request $request, Closure $next)
    {
        $user = $request->user();

        if (!$user || $user->rol !== 'admin') {
            return response()->json([
                'message' => 'Accés denegat.',
            ], Response::HTTP_FORBIDDEN);
        }

        return $next($request);
    }
}
