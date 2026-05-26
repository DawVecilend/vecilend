<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\AdminLogResource;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpFoundation\StreamedResponse;

class AdminLogController extends Controller
{
    public function index(Request $request)
    {
        $request->validate([
            'tipus'    => 'nullable|string|max:30',
            'accio'    => 'nullable|string|max:100',
            'entitat'  => 'nullable|string|max:50',
            'actor'    => 'nullable|string|max:100',
            'per_page' => 'nullable|integer|min:1|max:200',
            'page'     => 'nullable|integer|min:1',
        ]);

        $query = $this->baseQuery();
        $this->applyFilters($query, $request);

        $perPage = (int) $request->input('per_page', 20);
        $paginator = $query->paginate($perPage);

        return AdminLogResource::collection($paginator);
    }

    /**
     * GET /api/v1/backoffice/logs/filters
     *
     * Devuelve los valores distintos de tipus, accio y entitat afectada
     * para alimentar los selectores del frontend sin tener que cargar
     * todos los logs.
     */
    public function filters()
    {
        $tipus    = DB::table('logs')->select('tipus')->whereNotNull('tipus')->distinct()->orderBy('tipus')->pluck('tipus');
        $accions  = DB::table('logs')->select('accio')->whereNotNull('accio')->distinct()->orderBy('accio')->pluck('accio');
        $entitats = DB::table('logs')->select('entitat_afectada')->whereNotNull('entitat_afectada')->distinct()->orderBy('entitat_afectada')->pluck('entitat_afectada');

        return response()->json([
            'data' => [
                'tipus'    => $tipus->values(),
                'accions'  => $accions->values(),
                'entitats' => $entitats->values(),
            ],
        ]);
    }

    public function export(Request $request): StreamedResponse
    {
        $query = $this->baseQuery();
        $this->applyFilters($query, $request);

        $filename = 'vecilend_logs_' . Carbon::now()->format('Y-m-d_His') . '.csv';

        return new StreamedResponse(function () use ($query) {
            $out = fopen('php://output', 'w');
            fwrite($out, "\xEF\xBB\xBF");
            fputcsv($out, [
                'id', 'created_at', 'tipus', 'accio',
                'user_id', 'user_username', 'user_email',
                'empleat_id', 'empleat_username', 'empleat_email', 'empleat_rol',
                'entitat_afectada', 'id_entitat_afectada', 'ip', 'detall',
            ]);

            $query->orderByDesc('logs.created_at')->chunk(500, function ($logs) use ($out) {
                foreach ($logs as $log) {
                    fputcsv($out, array_map([$this, 'csvSanitize'], [
                        $log->id,
                        $log->created_at,
                        $log->tipus,
                        $log->accio,
                        $log->user_id,
                        $log->user_username,
                        $log->user_email,
                        $log->empleat_id,
                        $log->empleat_username,
                        $log->empleat_email,
                        $log->empleat_rol,
                        $log->entitat_afectada,
                        $log->id_entitat_afectada,
                        $log->ip,
                        $log->detall,
                    ]));
                }
            });

            fclose($out);
        }, 200, [
            'Content-Type'        => 'text/csv; charset=UTF-8',
            'Content-Disposition' => "attachment; filename=\"{$filename}\"",
        ]);
    }

    protected function csvSanitize($value): string
    {
        $str = (string) ($value ?? '');
        if ($str !== '' && in_array($str[0], ['=', '+', '-', '@', "\t", "\r"], true)) {
            return "'" . $str;
        }
        return $str;
    }

    public function clean(Request $request)
    {
        $validated = $request->validate([
            'days' => 'nullable|integer|min:1|max:3650',
        ]);

        $days = (int) ($validated['days'] ?? 90);
        $cutoff = Carbon::now()->subDays($days);

        $deleted = DB::table('logs')->where('created_at', '<', $cutoff)->delete();

        DB::table('logs')->insert([
            'user_id'             => null,
            'empleat_id'          => $request->user()->id,
            'tipus'               => 'admin',
            'accio'               => 'logs_clean',
            'detall'              => json_encode([
                'days'    => $days,
                'cutoff'  => $cutoff->toDateTimeString(),
                'deleted' => $deleted,
            ]),
            'entitat_afectada'    => 'log',
            'id_entitat_afectada' => null,
            'ip'                  => $request->ip(),
            'created_at'          => now(),
        ]);

        return response()->json([
            'message' => "Se han eliminado {$deleted} registros anteriores a {$cutoff->toDateString()} ({$days} días).",
            'deleted' => $deleted,
            'cutoff'  => $cutoff->toDateTimeString(),
        ]);
    }

    protected function applyFilters($query, Request $request): void
    {
        if ($request->filled('tipus') && $request->input('tipus') !== 'all') {
            $query->where('logs.tipus', $request->input('tipus'));
        }
        if ($request->filled('accio') && $request->input('accio') !== 'all') {
            $query->where('logs.accio', $request->input('accio'));
        }
        if ($request->filled('entitat') && $request->input('entitat') !== 'all') {
            $query->where('logs.entitat_afectada', $request->input('entitat'));
        }
        if ($request->filled('actor')) {
            $q = '%' . strtolower($request->input('actor')) . '%';
            $query->where(function ($w) use ($q) {
                $w->whereRaw('LOWER(users.username) LIKE ?', [$q])
                    ->orWhereRaw('LOWER(users.email) LIKE ?', [$q])
                    ->orWhereRaw('LOWER(empleats.username) LIKE ?', [$q])
                    ->orWhereRaw('LOWER(empleats.email) LIKE ?', [$q]);
            });
        }
    }

    protected function baseQuery()
    {
        return DB::table('logs')
            ->leftJoin('users', 'logs.user_id', '=', 'users.id')
            ->leftJoin('empleats', 'logs.empleat_id', '=', 'empleats.id')
            ->orderByDesc('logs.created_at')
            ->select([
                'logs.id',
                'logs.user_id',
                'users.username as user_username',
                'users.email as user_email',
                'logs.empleat_id',
                'empleats.username as empleat_username',
                'empleats.email as empleat_email',
                'empleats.rol as empleat_rol',
                'logs.tipus',
                'logs.accio',
                'logs.detall',
                'logs.entitat_afectada',
                'logs.id_entitat_afectada',
                'logs.ip',
                'logs.created_at',
            ]);
    }
}
