<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\ReportResource;
use App\Models\Report;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\DB;

class AdminReportController extends Controller
{
    public function index(Request $request)
    {
        $query = Report::with(['reportador', 'usuariReportat', 'objecte', 'revisor']);

        if ($request->filled('estat')) {
            $query->where('estat', $request->input('estat'));
        }

        if ($request->filled('motiu')) {
            $query->where('motiu', $request->input('motiu'));
        }

        $reports = $query->orderByDesc('created_at')->get();
        return ReportResource::collection($reports);
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
            'estat'           => 'required|string|in:resolt,descartat',
            'resolucio_nota'  => 'nullable|string|max:2000',
            'bloquear_usuari' => 'nullable|boolean',
            'eliminar_objecte' => 'nullable|boolean',
        ]);

        $report = Report::with(['usuariReportat', 'objecte'])->find($id);
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

        DB::transaction(function () use ($report, $validated, $request) {
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
                }

                if (!empty($validated['eliminar_objecte']) && $report->objecte_id) {
                    DB::table('objectes')->where('id', $report->objecte_id)->delete();
                }
            }
        });

        $this->logAction($request, 'resolve', $report, [
            'estat' => $validated['estat'],
            'bloquear_usuari'  => (bool)($validated['bloquear_usuari'] ?? false),
            'eliminar_objecte' => (bool)($validated['eliminar_objecte'] ?? false),
        ]);

        $report->load(['reportador', 'usuariReportat', 'objecte', 'revisor']);
        return new ReportResource($report);
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
