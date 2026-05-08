<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\StoreTransactionRequest;
use App\Http\Resources\TransactionResource;
use App\Models\Conversa;
use App\Models\Missatge;
use App\Models\Notificacio;
use App\Models\Objecte;
use App\Models\Pagament;
use App\Models\Solicitud;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class TransactionController extends Controller
{
    private const REQUEST_STATUSES     = ['pendent', 'rebutjat', 'cancellat'];
    private const TRANSACTION_STATUSES = ['en_curs', 'finalitzat', 'cancellat'];

    /**
     * GET /api/v1/transactions
     *
     * Filtres:
     *   view:   'requests' (default) | 'transactions'
     *   role:   'requester' | 'owner'  (només té efecte en view=requests)
     *   status: estat dins l'àmbit corresponent
     *   objecte_id, page, per_page
     *
     * Resposta:
     *   data:   array<TransactionResource>
     *   meta:   pagador
     *   counts: { all, pendent, rebutjat?, cancellat?, en_curs?, finalitzat? }
     */
    public function index(Request $request)
    {
        $request->validate([
            'view'       => ['nullable', 'string', 'in:requests,transactions'],
            'role'       => ['nullable', 'string', 'in:requester,owner'],
            'status'     => ['nullable', 'string'],
            'objecte_id' => ['nullable', 'integer', 'exists:objectes,id'],
            'per_page'   => ['nullable', 'integer', 'min:1', 'max:30'],
            'page'       => ['nullable', 'integer', 'min:1'],
        ]);

        $user   = $request->user();
        $view   = $request->input('view', 'requests');
        $role   = $request->input('role');
        $status = $request->input('status');

        // ── Counts (sense filtre d'estat, però sí amb filtre de role/objecte) ──
        $counts = $this->buildCounts($user, $view, $role, $request->input('objecte_id'));

        // ── Query principal ──
        $query = $this->scopedQuery($user, $view, $role)
            ->with([
                'objecte.user:id,username,nom,cognoms,avatar_url',
                'objecte.imatges',
                'solicitant:id,username,nom,cognoms,avatar_url',
                'transaccio.pagaments',
            ]);

        if ($request->filled('objecte_id')) {
            $query->where('objecte_id', $request->input('objecte_id'));
        }

        if ($status) {
            $allowed = $view === 'transactions' ? self::TRANSACTION_STATUSES : self::REQUEST_STATUSES;
            if (in_array($status, $allowed, true)) {
                if ($view === 'transactions') {
                    $query->whereHas('transaccio', fn($q) => $q->where('estat', $status));
                } else {
                    $query->where('estat', $status);
                }
            }
        }

        $perPage = (int) $request->input('per_page', 8);
        $solicituds = $query->orderByDesc('created_at')->paginate($perPage);

        return TransactionResource::collection($solicituds)
            ->additional(['counts' => $counts]);
    }

    /**
     * Construeix la query base segons view i role, sense filtre d'estat.
     */
    private function scopedQuery($user, string $view, ?string $role)
    {
        $query = Solicitud::query();

        if ($view === 'transactions') {
            // Participo com a propietari o solicitant + ha d'haver-hi transaccio
            $query->where(function ($q) use ($user) {
                $q->where('solicitant_id', $user->id)
                    ->orWhereHas('objecte', fn($oq) => $oq->where('user_id', $user->id));
            })->whereHas('transaccio');
            return $query;
        }

        // view = requests: només solicituds que NO han arribat a transacció
        if ($role === 'requester') {
            $query->where('solicitant_id', $user->id);
        } elseif ($role === 'owner') {
            $query->whereHas('objecte', fn($oq) => $oq->where('user_id', $user->id));
        } else {
            $query->where(function ($q) use ($user) {
                $q->where('solicitant_id', $user->id)
                    ->orWhereHas('objecte', fn($oq) => $oq->where('user_id', $user->id));
            });
        }

        $query->whereIn('estat', self::REQUEST_STATUSES);
        return $query;
    }

    /**
     * Comptadors per al panell de chips. Mateix àmbit role/view, ignorant el filtre d'estat.
     */
    private function buildCounts($user, string $view, ?string $role, $objecteId = null): array
    {
        $base = $this->scopedQuery($user, $view, $role);
        if ($objecteId) {
            $base->where('objecte_id', $objecteId);
        }

        if ($view === 'transactions') {
            $rows = $base->join('transaccions', 'transaccions.solicitud_id', '=', 'solicituds.id')
                ->groupBy('transaccions.estat')
                ->selectRaw('transaccions.estat as estat, COUNT(*) as total')
                ->pluck('total', 'estat');
            $allowed = self::TRANSACTION_STATUSES;
        } else {
            $rows = $base->groupBy('estat')
                ->selectRaw('estat, COUNT(*) as total')
                ->pluck('total', 'estat');
            $allowed = self::REQUEST_STATUSES;
        }

        $counts = ['all' => 0];
        foreach ($allowed as $st) {
            $counts[$st] = (int) ($rows[$st] ?? 0);
            $counts['all'] += $counts[$st];
        }
        return $counts;
    }

    /**
     * POST /api/v1/transactions — Crea una sol·licitud.
     */
    public function store(StoreTransactionRequest $request): JsonResponse
    {
        $validated = $request->validated();
        $user      = $request->user();
        $objecte   = Objecte::findOrFail($validated['objecte_id']);

        if ($objecte->user_id === $user->id) {
            return response()->json([
                'message' => 'No puedes solicitar tu propio objeto.',
                'errors'  => ['objecte_id' => ['L\'objecte que sol·licites és teu.']],
            ], 422);
        }

        if ($objecte->tipus === 'lloguer' && !$objecte->preu_diari) {
            return response()->json([
                'message' => 'Este objeto no tiene precio de alquiler configurado.',
                'errors'  => ['objecte_id' => ['L\'objecte no té preu_diari per a lloguer.']],
            ], 422);
        }

        $jaPendent = Solicitud::where('solicitant_id', $user->id)
            ->where('objecte_id', $objecte->id)
            ->where('estat', 'pendent')
            ->exists();

        if ($jaPendent) {
            return response()->json([
                'message' => 'Ya tienes una solicitud pendiente sobre este objeto. Espera a que el propietario responda.',
                'errors'  => ['objecte_id' => ['Ja tens una sol·licitud pendent sobre aquest objecte.']],
            ], 422);
        }

        $hiHaSolapament = Solicitud::ocupenDates(
            $objecte->id,
            $validated['data_inici'],
            $validated['data_fi']
        )->exists();

        if ($hiHaSolapament) {
            return response()->json([
                'message' => 'Las fechas seleccionadas no están disponibles.',
                'errors'  => ['data_inici' => ['Hi ha una altra sol·licitud acceptada en aquestes dates.']],
            ], 422);
        }

        $solicitud = DB::transaction(function () use ($validated, $user, $objecte) {
            $solicitud = Solicitud::create([
                'solicitant_id' => $user->id,
                'objecte_id'    => $objecte->id,
                'data_inici'    => $validated['data_inici'],
                'data_fi'       => $validated['data_fi'],
                'tipus'         => $objecte->tipus,
                'missatge'      => $validated['missatge'] ?? null,
                'estat'         => 'pendent',
            ]);

            Notificacio::create([
                'user_id'                 => $objecte->user_id,
                'tipus'                   => Notificacio::TIPUS_SOLICITUD_REBUDA,
                'titol'                   => 'Nueva solicitud',
                'missatge'                => "{$user->nom} ha solicitado tu objeto «{$objecte->nom}».",
                'entitat_referenciada'    => 'solicitud',
                'id_entitat_referenciada' => $solicitud->id,
            ]);

            if (!empty($solicitud->missatge)) {
                $conversa = Conversa::firstOrCreateForPair($user->id, $objecte->user_id, $objecte->id);
                Missatge::create([
                    'conversa_id' => $conversa->id,
                    'emissor_id'  => $user->id,
                    'objecte_id'  => $objecte->id,
                    'solicitud_id' => $solicitud->id,
                    'contingut'   => $solicitud->missatge,
                    'created_at'  => now(),
                ]);
                $conversa->touch();
            }

            return $solicitud;
        });

        $solicitud->load(['objecte.user', 'objecte.imatges', 'solicitant', 'transaccio.pagaments']);

        return (new TransactionResource($solicitud))->response()->setStatusCode(201);
    }

    /**
     * PUT /api/v1/transactions/{id}/accept
     */
    public function accept(int $id): JsonResponse
    {
        $solicitud = Solicitud::with(['objecte.user', 'objecte.imatges', 'solicitant', 'transaccio.pagaments'])
            ->findOrFail($id);

        $this->authorize('accept', $solicitud);

        if ($solicitud->estat !== 'pendent') {
            return response()->json([
                'message' => 'Esta solicitud no se puede aceptar.',
                'errors'  => ['estat' => ["L'estat actual és '{$solicitud->estat}'."]],
            ], 422);
        }

        $hiHaSolapament = Solicitud::ocupenDates(
            $solicitud->objecte_id,
            $solicitud->data_inici->toDateString(),
            $solicitud->data_fi->toDateString()
        )->where('id', '!=', $solicitud->id)->exists();

        if ($hiHaSolapament) {
            return response()->json([
                'message' => 'Las fechas ya no están disponibles.',
                'errors'  => ['data_inici' => ['S\'ha acceptat una altra sol·licitud per aquestes dates.']],
            ], 422);
        }

        DB::transaction(function () use ($solicitud) {
            $solicitud->update(['estat' => 'acceptat']);

            $solicitud->transaccio()->create([
                'data_inici_real' => null,    // Es complimenta al tancament
                'data_fi_real'    => null,
                'estat'           => 'en_curs',
            ]);

            $solicitud->objecte()->update(['estat' => 'no_disponible']);

            // Notificació d'acceptació
            Notificacio::create([
                'user_id'                 => $solicitud->solicitant_id,
                'tipus'                   => Notificacio::TIPUS_SOLICITUD_ACCEPTADA,
                'titol'                   => 'Solicitud aceptada',
                'missatge'                => "Tu solicitud para «{$solicitud->objecte->nom}» ha sido aceptada.",
                'entitat_referenciada'    => 'solicitud',
                'id_entitat_referenciada' => $solicitud->id,
            ]);

            // Si és lloguer, avis al solicitant que s'ha de pagar
            if ($solicitud->tipus === 'lloguer') {
                Notificacio::create([
                    'user_id'                 => $solicitud->solicitant_id,
                    'tipus'                   => Notificacio::TIPUS_TRANSACCIO_PAGAMENT_PENDENT,
                    'titol'                   => 'Pago pendiente',
                    'missatge'                => "Tu reserva de «{$solicitud->objecte->nom}» requiere el pago para confirmarse.",
                    'entitat_referenciada'    => 'solicitud',
                    'id_entitat_referenciada' => $solicitud->id,
                ]);
            }
        });

        $solicitud->refresh()->load(['objecte.user', 'objecte.imatges', 'solicitant', 'transaccio.pagaments']);

        return response()->json([
            'message' => 'Solicitud aceptada correctamente.',
            'data'    => new TransactionResource($solicitud),
        ], 200);
    }

    /**
     * PUT /api/v1/transactions/{id}/reject
     */
    public function reject(int $id): JsonResponse
    {
        $solicitud = Solicitud::with(['objecte.user', 'objecte.imatges', 'solicitant', 'transaccio.pagaments'])
            ->findOrFail($id);

        $this->authorize('reject', $solicitud);

        if ($solicitud->estat !== 'pendent') {
            return response()->json([
                'message' => 'Esta solicitud no se puede rechazar.',
                'errors'  => ['estat' => ["El estado actual es '{$solicitud->estat}'."]],
            ], 422);
        }

        $solicitud->update(['estat' => 'rebutjat']);

        Notificacio::create([
            'user_id'                 => $solicitud->solicitant_id,
            'tipus'                   => Notificacio::TIPUS_SOLICITUD_REBUTJADA,
            'titol'                   => 'Solicitud rechazada',
            'missatge'                => "Tu solicitud para «{$solicitud->objecte->nom}» ha sido rechazada.",
            'entitat_referenciada'    => 'solicitud',
            'id_entitat_referenciada' => $solicitud->id,
        ]);

        $solicitud->refresh()->load(['objecte.user', 'objecte.imatges', 'solicitant', 'transaccio.pagaments']);

        return response()->json([
            'message' => 'Solicitud rechazada correctamente.',
            'data'    => new TransactionResource($solicitud),
        ], 200);
    }

    /**
     * PUT /api/v1/transactions/{id}/cancel
     *
     * Cancel·la una solicitud o una transacció segons el seu estat:
     *   - solicitud 'pendent'             → solicitud a 'cancellat'
     *   - transacció 'en_curs' sense pagament i abans de data_inici → cancel·la la transacció
     */
    public function cancel(int $id, Request $request): JsonResponse
    {
        $solicitud = Solicitud::with(['objecte.user', 'objecte.imatges', 'solicitant', 'transaccio.pagaments'])
            ->findOrFail($id);

        $user = $request->user();

        // Cas A: solicitud encara pendent
        if ($solicitud->estat === 'pendent') {
            $this->authorize('cancelRequest', $solicitud);

            DB::transaction(function () use ($solicitud, $user) {
                $solicitud->update(['estat' => 'cancellat']);

                Notificacio::create([
                    'user_id'                 => $solicitud->objecte->user_id,
                    'tipus'                   => Notificacio::TIPUS_SOLICITUD_CANCELLADA,
                    'titol'                   => 'Solicitud cancelada',
                    'missatge'                => "{$user->nom} ha cancelado su solicitud sobre «{$solicitud->objecte->nom}».",
                    'entitat_referenciada'    => 'solicitud',
                    'id_entitat_referenciada' => $solicitud->id,
                ]);
            });

            $solicitud->refresh()->load(['objecte.user', 'objecte.imatges', 'solicitant', 'transaccio.pagaments']);
            return response()->json([
                'message' => 'Solicitud cancelada.',
                'data'    => new TransactionResource($solicitud),
            ], 200);
        }

        // Cas B: transacció en curs
        $this->authorize('cancelTransaction', $solicitud);

        $transaccio = $solicitud->transaccio;
        if (!$transaccio) {
            return response()->json([
                'message' => 'No hay transacción que cancelar.',
            ], 422);
        }

        DB::transaction(function () use ($solicitud, $transaccio, $user) {
            $transaccio->update(['estat' => 'cancellat', 'data_fi_real' => now()]);

            // L'objecte torna a estar disponible
            $solicitud->objecte()->update(['estat' => 'disponible']);

            // Avisem la part contrària
            $altreId = $user->id === $solicitud->solicitant_id
                ? $solicitud->objecte->user_id
                : $solicitud->solicitant_id;

            Notificacio::create([
                'user_id'                 => $altreId,
                'tipus'                   => Notificacio::TIPUS_TRANSACCIO_CANCELLADA,
                'titol'                   => 'Transacción cancelada',
                'missatge'                => "{$user->nom} ha cancelado la transacción de «{$solicitud->objecte->nom}».",
                'entitat_referenciada'    => 'solicitud',
                'id_entitat_referenciada' => $solicitud->id,
            ]);
        });

        $solicitud->refresh()->load(['objecte.user', 'objecte.imatges', 'solicitant', 'transaccio.pagaments']);

        return response()->json([
            'message' => 'Transacción cancelada.',
            'data'    => new TransactionResource($solicitud),
        ], 200);
    }

    /**
     * PUT /api/v1/transactions/{id}/return — "Confirmar recepción del objeto"
     *
     * Tanca la transacció i marca l'objecte com a disponible.
     */
    public function returnObject(int $id): JsonResponse
    {
        $solicitud = Solicitud::with(['objecte.user', 'objecte.imatges', 'solicitant', 'transaccio.pagaments'])
            ->findOrFail($id);

        $this->authorize('returnObject', $solicitud);

        if ($solicitud->estat !== 'acceptat') {
            return response()->json([
                'message' => 'Esta transacción no está activa.',
                'errors'  => ['estat' => ["L'estat actual de la solicitud és '{$solicitud->estat}'."]],
            ], 422);
        }

        $transaccio = $solicitud->transaccio;
        if (!$transaccio || $transaccio->estat !== 'en_curs') {
            return response()->json([
                'message' => 'No hay transacción activa para esta solicitud.',
            ], 422);
        }

        DB::transaction(function () use ($solicitud, $transaccio) {
            $transaccio->update([
                'data_inici_real' => $transaccio->data_inici_real ?? $solicitud->data_inici,
                'data_fi_real'    => now(),
                'estat'           => 'finalitzat',
            ]);

            $solicitud->objecte()->update(['estat' => 'disponible']);
            // Solicitud ja ha quedat 'acceptat' (no toquem). El cicle de
            // tancament el porta la transaccio a partir d'aquí.
        });

        $solicitud->refresh()->load(['objecte.user', 'objecte.imatges', 'solicitant', 'transaccio.pagaments']);

        return response()->json([
            'message' => 'Recepción confirmada correctamente.',
            'data'    => new TransactionResource($solicitud),
        ], 200);
    }

    /**
     * POST /api/v1/transactions/{id}/payment
     *
     * Mock de passarel·la: crea un Pagament en estat 'completat'.
     */
    public function pay(int $id, Request $request): JsonResponse
    {
        $solicitud = Solicitud::with(['objecte.user', 'objecte.imatges', 'solicitant', 'transaccio.pagaments'])
            ->findOrFail($id);

        $this->authorize('pay', $solicitud);

        $transaccio = $solicitud->transaccio;
        $dies   = (int) abs($solicitud->data_inici->diffInDays($solicitud->data_fi)) + 1;
        $import = round($dies * (float) $solicitud->objecte->preu_diari, 2);

        DB::transaction(function () use ($transaccio, $request, $import) {
            Pagament::create([
                'transaccio_id'   => $transaccio->id,
                'pagador_id'      => $request->user()->id,
                'tipus'           => 'lloguer',
                'import'          => $import,
                'estat'           => Pagament::ESTAT_COMPLETAT,
                'metode_pagament' => 'mock',
                'referencia_mock' => 'MOCK_' . strtoupper(Str::random(12)),
                'notes'           => 'Pagament simulat des de la pasarel·la mock.',
            ]);
        });

        $solicitud->refresh()->load(['objecte.user', 'objecte.imatges', 'solicitant', 'transaccio.pagaments']);

        return response()->json([
            'message' => 'Pago registrado correctamente.',
            'data'    => new TransactionResource($solicitud),
        ], 200);
    }
}
