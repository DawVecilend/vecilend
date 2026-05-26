<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\ReportResource;
use App\Mail\AccountBlockedMail;
use App\Models\Notificacio;
use App\Models\Report;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class AdminReportController extends Controller
{
    public function index(Request $request)
    {
        $request->validate([
            'estat'    => 'nullable|string|in:all,pendent,resolt,descartat',
            'motiu'    => 'nullable|string|max:50',
            'per_page' => 'nullable|integer|min:1|max:100',
            'page'     => 'nullable|integer|min:1',
        ]);

        $query = Report::with(['reportador', 'usuariReportat', 'objecte', 'revisor'])
            ->orderByDesc('created_at');

        $estat = $request->input('estat', 'all');
        if ($estat !== 'all' && $estat) {
            $query->where('estat', $estat);
        }

        $motiu = $request->input('motiu');
        if ($motiu && $motiu !== 'all') {
            $query->where('motiu', $motiu);
        }

        $perPage = (int) $request->input('per_page', 20);
        return ReportResource::collection($query->paginate($perPage));
    }

    public function show(Request $request, $id)
    {
        $report = Report::with(['reportador', 'usuariReportat', 'objecte', 'revisor'])
            ->find($id);

        if (!$report) {
            return response()->json([
                'message' => 'Reporte no encontrado.',
            ], Response::HTTP_NOT_FOUND);
        }

        return new ReportResource($report);
    }

    public function resolve(Request $request, $id)
    {
        $validated = $request->validate([
            'estat'            => 'required|string|in:resolt,descartat',
            'resolucio_nota'   => 'nullable|string|max:2000',
            'bloquear_usuari'  => 'nullable|boolean',
            'eliminar_objecte' => 'nullable|boolean',
        ]);

        $report = Report::with(['reportador', 'usuariReportat', 'objecte'])->find($id);
        if (!$report) {
            return response()->json([
                'message' => 'Reporte no encontrado.',
            ], Response::HTTP_NOT_FOUND);
        }

        if ($report->estat !== Report::ESTAT_PENDENT) {
            return response()->json([
                'message' => 'Este reporte ya está cerrado.',
            ], Response::HTTP_BAD_REQUEST);
        }

        $empleat = $request->user();
        $esAdmin = $empleat && $empleat->rol === 'admin';

        if (!empty($validated['eliminar_objecte']) && !$esAdmin
            && $report->motiu !== Report::MOTIU_OBJECTE_INAPROPIAT) {
            return response()->json([
                'message' => 'Como soporte, solo puedes eliminar objetos en reportes por objeto inapropiado.',
            ], Response::HTTP_FORBIDDEN);
        }

        $usuariBloquejat = false;

        DB::transaction(function () use ($report, $validated, $request, &$usuariBloquejat) {
            $report->update([
                'estat'          => $validated['estat'],
                'resolucio_nota' => $validated['resolucio_nota'] ?? null,
                'revisor_id'     => $request->user()->id,
                'resolt_at'      => now(),
            ]);

            if ($validated['estat'] === Report::ESTAT_RESOLT) {
                if (!empty($validated['bloquear_usuari']) && $report->usuariReportat && $report->usuariReportat->actiu) {
                    DB::table('users')
                        ->where('id', $report->usuari_reportat_id)
                        ->update(['actiu' => false, 'updated_at' => now()]);
                    DB::table('personal_access_tokens')
                        ->where('tokenable_type', \App\Models\User::class)
                        ->where('tokenable_id', $report->usuari_reportat_id)
                        ->delete();
                    $usuariBloquejat = true;
                }

                if (!empty($validated['eliminar_objecte']) && $report->objecte_id) {
                    DB::table('objectes')->where('id', $report->objecte_id)->delete();
                }
            }
        });

        $this->notifyReportador($report, $validated['estat'], $usuariBloquejat);

        if ($usuariBloquejat && $report->usuariReportat) {
            try {
                Mail::to($report->usuariReportat->email)
                    ->send(new AccountBlockedMail(
                        $report->usuariReportat->nom,
                        $validated['resolucio_nota'] ?? null,
                        $report->motiu
                    ));
            } catch (\Throwable $e) {
                Log::warning('No se pudo enviar el email de bloqueo', [
                    'user_id' => $report->usuari_reportat_id,
                    'error'   => $e->getMessage(),
                ]);
            }
        }

        $this->logAction($request, 'resolve', $report, [
            'estat' => $validated['estat'],
            'bloquear_usuari'  => (bool)($validated['bloquear_usuari'] ?? false),
            'eliminar_objecte' => (bool)($validated['eliminar_objecte'] ?? false),
        ]);

        $report->load(['reportador', 'usuariReportat', 'objecte', 'revisor']);
        return new ReportResource($report);
    }

    protected function notifyReportador(Report $report, string $estat, bool $usuariBloquejat): void
    {
        if (!$report->reportador) return;

        if ($estat === Report::ESTAT_DESCARTAT) {
            Notificacio::create([
                'user_id'                 => $report->reportador_id,
                'tipus'                   => 'report_descartat',
                'titol'                   => 'Tu reporte ha sido revisado',
                'missatge'                => 'Tras revisar tu reporte, el equipo de Vecilend ha decidido descartarlo. Gracias por ayudarnos a mantener la comunidad segura.',
                'entitat_referenciada'    => 'report',
                'id_entitat_referenciada' => $report->id,
                'dades_extra'             => [
                    'report_id' => $report->id,
                    'motiu'     => $report->motiu,
                ],
                'created_at'              => now(),
            ]);
            return;
        }

        if ($estat === Report::ESTAT_RESOLT && $usuariBloquejat) {
            Notificacio::create([
                'user_id'                 => $report->reportador_id,
                'tipus'                   => 'report_resolt_bloqueig',
                'titol'                   => 'Tu reporte ha sido revisado',
                'missatge'                => 'Gracias por tu reporte. El usuario reportado ha sido bloqueado tras la revisión por parte del equipo.',
                'entitat_referenciada'    => 'report',
                'id_entitat_referenciada' => $report->id,
                'dades_extra'             => [
                    'report_id' => $report->id,
                    'motiu'     => $report->motiu,
                ],
                'created_at'              => now(),
            ]);
        }
    }

    protected function logAction(Request $request, string $action, Report $report, array $details = []): void
    {
        DB::table('logs')->insert([
            'user_id'    => null,
            'empleat_id' => $request->user()->id,
            'tipus'      => 'admin',
            'accio'      => "report_{$action}",
            'detall'     => json_encode($details),
            'entitat_afectada'    => 'report',
            'id_entitat_afectada' => $report->id,
            'ip'         => $request->ip(),
            'created_at' => now(),
        ]);
    }
}
