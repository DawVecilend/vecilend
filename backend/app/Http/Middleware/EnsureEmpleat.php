<?php

namespace App\Http\Middleware;

use App\Models\Empleat;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class EnsureEmpleat
{
    public function handle(Request $request, Closure $next, ?string $rol = null)
    {
        $empleat = $request->user();

        if (!$empleat || !$empleat instanceof Empleat || !$empleat->actiu) {
            return response()->json([
                'message' => 'Acceso denegado.',
            ], Response::HTTP_FORBIDDEN);
        }

        if ($rol !== null && $empleat->rol !== $rol) {
            return response()->json([
                'message' => 'No tienes permisos suficientes para esta acción.',
            ], Response::HTTP_FORBIDDEN);
        }

        return $next($request);
    }
}
