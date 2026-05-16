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
        $query = $this->baseQuery();

        if ($request->filled('tipus')) {
            $query->where('logs.tipus', $request->input('tipus'));
        }

        $logs = $query->get();

        return AdminLogResource::collection($logs);
    }

    /**
     * GET /api/v1/backoffice/logs/export
     * Devuelve un CSV con todos los logs (o filtrados por tipus).
     */
    public function export(Request $request): StreamedResponse
    {
        $query = $this->baseQuery();

        if ($request->filled('tipus')) {
            $query->where('logs.tipus', $request->input('tipus'));
        }

        $filename = 'vecilend_logs_' . Carbon::now()->format('Y-m-d_His') . '.csv';

        return new StreamedResponse(function () use ($query) {
            $out = fopen('php://output', 'w');

            // BOM para que Excel detecte UTF-8
            fwrite($out, "\xEF\xBB\xBF");

            fputcsv($out, [
                'id', 'created_at', 'tipus', 'accio',
                'user_id', 'user_username', 'user_email',
                'empleat_id', 'empleat_username', 'empleat_email', 'empleat_rol',
                'entitat_afectada', 'id_entitat_afectada', 'ip', 'detall',
            ]);

            $query->orderByDesc('logs.created_at')->chunk(500, function ($logs) use ($out) {
                foreach ($logs as $log) {
                    fputcsv($out, [
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
                    ]);
                }
            });

            fclose($out);
        }, 200, [
            'Content-Type'        => 'text/csv; charset=UTF-8',
            'Content-Disposition' => "attachment; filename=\"{$filename}\"",
        ]);
    }

    /**
     * DELETE /api/v1/backoffice/logs
     * Elimina logs antiguos. Por defecto > 90 días.
     */
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
