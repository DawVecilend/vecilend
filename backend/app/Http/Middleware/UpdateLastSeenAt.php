<?php

namespace App\Http\Middleware;

use App\Models\User;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class UpdateLastSeenAt
{
    public function handle(Request $request, Closure $next)
    {
        $response = $next($request);

        $user = $request->user();

        if ($user instanceof User) {
            $shouldUpdate = !$user->last_seen_at
                || $user->last_seen_at->diffInSeconds(now()) >= 30;

            if ($shouldUpdate) {
                DB::table('users')
                    ->where('id', $user->id)
                    ->update(['last_seen_at' => now()]);
            }
        }

        return $response;
    }
}
