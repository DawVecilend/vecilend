<?php
use Illuminate\Support\Facades\Route;

Route::post('/register', [App\Http\Controllers\Api\V1\Auth\RegisterController::class, 'register']);

Route::post('/login', [App\Http\Controllers\Api\V1\Auth\LoginController::class, 'login']);
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (\Illuminate\Http\Request $request) {
        return new \App\Http\Resources\UserResource($request->user());
    });

    Route::post('/logout', [App\Http\Controllers\Api\V1\Auth\LoginController::class, 'logout']);
});