<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Resources\UserResource;
use App\Http\Controllers\Api\V1\UserController;
use App\Http\Controllers\Api\V1\Auth\LoginController;
use App\Http\Controllers\Api\V1\Auth\RegisterController;
use App\Http\Controllers\Api\V1\Auth\PasswordResetController;
use App\Http\Controllers\Api\V1\Auth\PasswordController;
use App\Http\Controllers\Api\V1\CategoriaController;
use App\Http\Controllers\Api\V1\ObjecteController;
use App\Http\Controllers\Api\V1\Auth\EmailVerificationController;
use App\Http\Controllers\Api\V1\TransactionController;

Route::post('/register', [RegisterController::class, 'register']);
Route::post('/login', [LoginController::class, 'login'])->middleware('throttle:login');
Route::post('/check-user', [RegisterController::class, 'checkUser']);
Route::post('/email/send-code',   [EmailVerificationController::class, 'sendCode']);
Route::post('/email/verify-code', [EmailVerificationController::class, 'verifyCode']);
Route::get('/profile/{username}', [UserController::class, 'getByUsername']);
Route::get('/profile/{username}/objects', [ObjecteController::class, 'getUserObjects']);
Route::post('/forgot-password', [PasswordResetController::class, 'forgotPassword']);
Route::post('/reset-password', [PasswordResetController::class, 'resetPassword']);
Route::get('/categories', [CategoriaController::class, 'index']);
Route::get('/objects', [ObjecteController::class, 'index']);
Route::get('/objects/nearby', [ObjecteController::class, 'nearby']);
Route::get('/objects/{id}', [ObjecteController::class, 'show'])->where('id', '[0-9]+');

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/me', function (Request $request) {
        return new UserResource($request->user());
    });
    Route::put('/user/proximity-radius', [UserController::class, 'updateProximityRadius']);
    Route::put('/profile/{username}/editing', [UserController::class, 'update']);
    Route::put('/profile/{username}/password', [UserController::class, 'updatePassword']);
    Route::post('/logout', [LoginController::class, 'logout']);
    Route::post('/objects', [ObjecteController::class, 'store']);
    Route::put('/objects/{id}', [ObjecteController::class, 'update'])->where('id', '[0-9]+');
    Route::delete('/objects/{id}', [ObjecteController::class, 'destroy'])->where('id', '[0-9]+');
    Route::post('/transactions', [TransactionController::class, 'store']);
    Route::put('/transactions/{id}/accept', [TransactionController::class, 'accept'])
        ->where('id', '[0-9]+');
    Route::put('/transactions/{id}/reject', [TransactionController::class, 'reject'])
        ->where('id', '[0-9]+');
});
