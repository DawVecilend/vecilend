<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Models\Categoria;
use App\Models\Objecte;
use App\Models\Transaccio;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AdminStatsController extends Controller
{
    public function index() {
        // Totals
        $totalStats = $this->totalStats();

        // Trends
        $weeklyTrends = $this->weeklyTrends();
        $monthlyTrends = $this->monthlyTrends();

        // Popular categories (top 5 by transaction count, excluding cancelled)
        $topCategories = $this->popularCategories();

        return response()->json([
            'totals' => $totalStats,
            'trends' => [
                'weekly' => $weeklyTrends,
                'monthly' => $monthlyTrends,
            ],
            'popular_categories' => $topCategories,
        ]);
    }

    public function totalStats() {
        return [
            'total_users' => User::count(),
            'total_objects' => Objecte::count(),
            'total_transactions' => Transaccio::where('estat', '!=', 'cancelada')->count(),
        ];
    }

    public function weeklyTrends() {
        return $this->buildTrends('IYYY-IW', 'week', 'subWeeks', 12);
    }

    public function monthlyTrends() {
        return $this->buildTrends('YYYY-MM', 'month', 'subMonths', 12);
    }

    public function popularCategories() {
        return Transaccio::selectRaw('categories.id, categories.nom, COUNT(*) as count')
            ->join('solicituds', 'transaccions.solicitud_id', '=', 'solicituds.id')
            ->join('objectes', 'solicituds.objecte_id', '=', 'objectes.id')
            ->join('categories', 'objectes.categoria_id', '=', 'categories.id')
            ->where('transaccions.estat', '!=', 'cancelada')
            ->groupBy('categories.id', 'categories.nom')
            ->orderBy('count', 'desc')
            ->limit(5)
            ->get()->map(function ($category) {
                return [
                    'id' => $category->id,
                    'nom' => $category->nom,
                    'count' => $category->count,
                    'top_objects' => $this->popularObjetsInCategory($category->id),
                ];
             });
    }

    private function popularObjetsInCategory($categoryId) {
        return Objecte::where('categoria_id', $categoryId)
            ->withCount(['transaccions' => function ($query) {
                $query->where('transaccions.estat', '!=', 'cancelada');
            }])
            ->orderBy('transaccions_count', 'desc')
            ->limit(5)
            ->get()
            ->map(fn($obj) => [
                'id' => $obj->id,
                'nom' => $obj->nom,
                'transactions_count' => $obj->transaccions_count,
            ]);
    }

    private function buildTrends(string $dateFormat, string $periodKey, string $subtractMethod, int $subtractValue)
    {
        return Transaccio::selectRaw("TO_CHAR(created_at, '{$dateFormat}') as period, COUNT(*) as count")
            ->where('estat', '!=', 'cancelada')
            ->where('created_at', '>=', now()->{$subtractMethod}($subtractValue))
            ->groupBy('period')
            ->orderBy('period')
            ->get()
            ->map(function ($item) use ($dateFormat, $periodKey) {
                $transactions = Transaccio::where('estat', '!=', 'cancelada')
                    ->whereRaw("TO_CHAR(created_at, '{$dateFormat}') = ?", [$item->period])
                    ->with(['solicitud' => function ($query) {
                        $query->with('objecte:id,nom,preu_diari', 'solicitant:id,nom,username', 'objecte.user:id,nom,username');
                    }])
                    ->orderBy('created_at', 'desc')
                    ->get();
                
                return [
                    $periodKey => $item->period,
                    'count' => $item->count,
                    'transactions' => $this->formatTransactions($transactions),
                ];
            });
    }

    private function formatTransactions($transactions)
    {
        return $transactions->map(fn($t) => [
            'id' => $t->id,
            'estat' => $t->estat,
            'created_at' => $t->created_at,
            'solicitud' => $t->solicitud ? [
                'id' => $t->solicitud->id,
                'objecte' => $t->solicitud->objecte ? [
                    'id' => $t->solicitud->objecte->id,
                    'nom' => $t->solicitud->objecte->nom,
                    'preu_diari' => $t->solicitud->objecte->preu_diari,
                ] : null,
                'solicitant' => $t->solicitud->solicitant ? [
                    'id' => $t->solicitud->solicitant->id,
                    'nom' => $t->solicitud->solicitant->nom,
                    'username' => $t->solicitud->solicitant->username,
                ] : null,
                'propietari' => $t->solicitud->objecte?->user ? [
                    'id' => $t->solicitud->objecte->user->id,
                    'nom' => $t->solicitud->objecte->user->nom,
                    'username' => $t->solicitud->objecte->user->username,
                ] : null,
                'data_inici' => $t->solicitud->data_inici,
                'data_fi' => $t->solicitud->data_fi,
            ] : null,
        ]);
    }
}
