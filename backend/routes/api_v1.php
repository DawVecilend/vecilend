<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Resources\UserResource;
use App\Http\Controllers\Api\V1\Auth\LoginController;
use App\Http\Controllers\Api\V1\Auth\RegisterController;
use App\Http\Controllers\Api\V1\Auth\PasswordResetController;
use App\Http\Controllers\Api\V1\CategoriaController;
use App\Http\Controllers\Api\V1\ObjecteController;

// ── Rutes públiques (sense autenticació) ──────────────────

// ── Rutes públiques (sense autenticació) ──────────────────

Route::post('/register', [RegisterController::class, 'register']);
Route::post('/login', [LoginController::class, 'login'])
    ->middleware('throttle:login');

Route::post('/forgot-password', [PasswordResetController::class, 'forgotPassword']);
Route::post('/reset-password',  [PasswordResetController::class, 'resetPassword']);

Route::get('/categories', [CategoriaController::class, 'index']);
Route::get('/objects', [ObjecteController::class, 'index']);
Route::get('/objects/{id}', [ObjecteController::class, 'show'])
    ->where('id', '[0-9]+');

// ── Rutes protegides (auth:sanctum) ───────────────────────

// ── Rutes protegides (auth:sanctum) ───────────────────────

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/me', function (Request $request) {
        return new UserResource($request->user());
    });
    Route::post('/logout', [LoginController::class, 'logout']);
});
