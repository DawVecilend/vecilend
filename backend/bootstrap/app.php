<?php

use App\Http\Middleware\ForceJsonResponse;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Facades\Route;
use Illuminate\Auth\Access\AuthorizationException;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__ . '/../routes/web.php',
        commands: __DIR__ . '/../routes/console.php',
        health: '/up',
        then: function () {
            Route::middleware('api')
                ->prefix('api/v1')
                ->group(base_path('routes/api_v1.php'));
        },
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->trustProxies(at: '*', headers:
            Request::HEADER_X_FORWARDED_FOR |
            Request::HEADER_X_FORWARDED_HOST |
            Request::HEADER_X_FORWARDED_PORT |
            Request::HEADER_X_FORWARDED_PROTO |
            Request::HEADER_X_FORWARDED_AWS_ELB
        );
        $middleware->prepend(ForceJsonResponse::class);
        $middleware->alias([
            'empleat'         => \App\Http\Middleware\EnsureEmpleat::class,
            'last_seen'       => \App\Http\Middleware\UpdateLastSeenAt::class,
            'log_user_action' => \App\Http\Middleware\LogUserAction::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->render(function (AuthenticationException $e, $request) {
            if ($request->expectsJson() || $request->is('api/*')) {
                return response()->json([
                    'message' => 'No autenticado.',
                ], 401);
            }
        });

        $exceptions->render(function (AuthorizationException $e, $request) {
            if ($request->expectsJson() || $request->is('api/*')) {
                return response()->json([
                    'message' => 'No tienes permiso para realizar esta acción.',
                ], 403);
            }
        });
    })
    ->booted(function () {
        RateLimiter::for('login', function (Request $request) {
            $key = strtolower((string) $request->input('login')) . '|' . $request->ip();
            return Limit::perMinute(5)->by($key);
        });

        RateLimiter::for('register', function (Request $request) {
            return Limit::perMinute(5)->by($request->ip());
        });

        RateLimiter::for('password-forgot', function (Request $request) {
            $email = strtolower((string) $request->input('email'));
            return [
                Limit::perMinute(3)->by($email),
                Limit::perMinute(10)->by($request->ip()),
            ];
        });

        RateLimiter::for('password-reset', function (Request $request) {
            $email = strtolower((string) $request->input('email'));
            return [
                Limit::perMinute(5)->by($email),
                Limit::perMinute(10)->by($request->ip()),
            ];
        });

        RateLimiter::for('email-verify', function (Request $request) {
            $email = strtolower((string) $request->input('email'));
            return [
                Limit::perMinute(3)->by($email),
                Limit::perMinute(10)->by($request->ip()),
            ];
        });
    })
    ->create();
