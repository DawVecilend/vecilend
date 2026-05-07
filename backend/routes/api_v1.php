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
use App\Http\Controllers\Api\V1\Admin\AdminCategoriaController;
use App\Http\Controllers\Api\V1\Admin\AdminLogController;
use App\Http\Controllers\Api\V1\Admin\AdminStatsController;
use App\Http\Controllers\Api\V1\Admin\AdminSubcategoriaController;
use App\Http\Controllers\Api\V1\Admin\AdminUserController;
use App\Http\Controllers\Api\V1\Auth\EmailVerificationController;
use App\Http\Controllers\Api\V1\TransactionController;
use App\Http\Middleware\EnsureAdminRole;
use App\Http\Controllers\FavoriteController;
use App\Http\Controllers\Api\V1\ValoracioController;
use App\Http\Controllers\Api\V1\ChatController;
use App\Http\Controllers\Api\V1\NotificacioController;
use App\Models\Conversa;
use App\Models\Notificacio;

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
Route::get('/users/{username}/reviews',           [ValoracioController::class, 'userReviews']);
Route::get('/users/{username}/reviews/evolution', [ValoracioController::class, 'evolution']);

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
    Route::get('/transactions',  [TransactionController::class, 'index']);
    Route::post('/transactions', [TransactionController::class, 'store']);
    Route::put('/transactions/{id}/accept',  [TransactionController::class, 'accept'])->where('id', '[0-9]+');
    Route::put('/transactions/{id}/reject',  [TransactionController::class, 'reject'])->where('id', '[0-9]+');
    Route::put('/transactions/{id}/return',  [TransactionController::class, 'returnObject'])->where('id', '[0-9]+');
    Route::put('/transactions/{id}/cancel',  [TransactionController::class, 'cancel'])->where('id', '[0-9]+');
    Route::post('/transactions/{id}/payment', [TransactionController::class, 'pay'])->where('id', '[0-9]+');
    Route::post('/transactions/{id}/review', [ValoracioController::class, 'store'])->where('id', '[0-9]+');
    Route::post('/objects/{id}/favorite', [FavoriteController::class, 'store'])->where('id', '[0-9]+');
    Route::delete('/objects/{id}/favorite', [FavoriteController::class, 'destroy'])->where('id', '[0-9]+');
    Route::get('/favorites', [FavoriteController::class, 'index']);

    // ── Xats ──
    Route::get('/chats',                      [ChatController::class, 'index']);
    Route::post('/chats',                     [ChatController::class, 'store']);
    Route::get('/chats/{id}',                 [ChatController::class, 'show'])->where('id', '[0-9]+');
    Route::get('/chats/{id}/messages',        [ChatController::class, 'messages'])->where('id', '[0-9]+');
    Route::post('/chats/{id}/messages',       [ChatController::class, 'sendMessage'])->where('id', '[0-9]+');
    Route::put('/chats/{id}/read',            [ChatController::class, 'markAsRead'])->where('id', '[0-9]+');

    // ── Notificacions ──
    Route::get('/notifications',              [NotificacioController::class, 'index']);
    Route::put('/notifications/read-all',     [NotificacioController::class, 'markAllAsRead']);
    Route::put('/notifications/{id}/read',    [NotificacioController::class, 'markAsRead'])->where('id', '[0-9]+');
    Route::delete('/notifications/{id}',      [NotificacioController::class, 'destroy'])->where('id', '[0-9]+');

    // ── Comptadors no llegits (per a les bombolles) ──
    Route::get('/me/unread-counts', function (Request $request) {
        $userId = $request->user()->id;

        $chats = Conversa::query()
            ->deUsuari($userId)
            ->whereHas('missatges', function ($q) use ($userId) {
                $q->where('emissor_id', '!=', $userId)->whereNull('llegit_at');
            })
            ->count();

        $notifications = Notificacio::where('user_id', $userId)
            ->where('llegida', false)
            ->count();

        // Solicituds pendents enviades per mi
        $requestsSentPending = \App\Models\Solicitud::where('solicitant_id', $userId)
            ->where('estat', 'pendent')
            ->count();

        // Solicituds pendents rebudes (sobre objectes meus)
        $requestsReceivedPending = \App\Models\Solicitud::whereHas('objecte', fn($q) => $q->where('user_id', $userId))
            ->where('estat', 'pendent')
            ->count();

        // Transaccions en curs de lloguer sense pagament completat (com a solicitant)
        $transactionsPaymentDue = \App\Models\Solicitud::where('solicitant_id', $userId)
            ->where('estat', 'acceptat')
            ->where('tipus', 'lloguer')
            ->whereHas('transaccio', fn($q) => $q->where('estat', 'en_curs'))
            ->whereDoesntHave('transaccio.pagaments', fn($q) => $q->where('estat', 'completat'))
            ->count();

        return response()->json([
            'data' => [
                'chats'         => $chats,
                'notifications' => $notifications,
                'orders'        => [
                    'requests_sent_pending'     => $requestsSentPending,
                    'requests_received_pending' => $requestsReceivedPending,
                    'transactions_payment_due'  => $transactionsPaymentDue,
                ],
            ],
        ]);
    });

    Route::prefix('admin')->middleware(EnsureAdminRole::class)->group(function () {
        Route::get('/stats', [AdminStatsController::class, 'index']);

        Route::get('/users', [AdminUserController::class, 'index']);
        Route::put('/users/{id}/block', [AdminUserController::class, 'block'])->where('id', '[0-9]+');
        Route::put('/users/{id}/unblock', [AdminUserController::class, 'unblock'])->where('id', '[0-9]+');
        Route::delete('/users/{id}', [AdminUserController::class, 'destroy'])->where('id', '[0-9]+');

        Route::get('/categories', [AdminCategoriaController::class, 'index']);
        Route::get('/categories/{id}', [AdminCategoriaController::class, 'show'])->where('id', '[0-9]+');
        Route::post('/categories', [AdminCategoriaController::class, 'store']);
        Route::put('/categories/{id}', [AdminCategoriaController::class, 'update'])->where('id', '[0-9]+');
        Route::delete('/categories/{id}', [AdminCategoriaController::class, 'destroy'])->where('id', '[0-9]+');

        Route::get('/subcategories', [AdminSubcategoriaController::class, 'index']);
        Route::get('/subcategories/{id}', [AdminSubcategoriaController::class, 'show'])->where('id', '[0-9]+');
        Route::post('/subcategories', [AdminSubcategoriaController::class, 'store']);
        Route::put('/subcategories/{id}', [AdminSubcategoriaController::class, 'update'])->where('id', '[0-9]+');
        Route::delete('/subcategories/{id}', [AdminSubcategoriaController::class, 'destroy'])->where('id', '[0-9]+');

        Route::get('/logs', [AdminLogController::class, 'index']);

        Route::get('/stats', [AdminStatsController::class, 'index']);
        Route::get('/stats/trends/weekly', [AdminStatsController::class, 'weeklyTrends']);
        Route::get('/stats/trends/monthly', [AdminStatsController::class, 'monthlyTrends']);
        Route::get('/stats/popular-categories', [AdminStatsController::class, 'popularCategories']);
    });
});
