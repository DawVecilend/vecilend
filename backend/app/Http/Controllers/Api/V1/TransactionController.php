<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\StoreTransactionRequest;
use App\Http\Resources\TransactionResource;
use App\Models\Objecte;
use App\Models\Solicitud;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class TransactionController extends Controller
{
    /**
     * POST /api/v1/transactions
     *
     * Crea una sol·licitud de préstec/lloguer per un objecte.
     * El tipus es deriva directament de l'objecte (prestec=gratis, lloguer=de pagament).
     *
     * Validacions:
     *   1. Camps bàsics (StoreTransactionRequest).
     *   2. No pots sol·licitar el teu propi objecte.
     *   3. Si l'objecte és de lloguer, ha de tenir preu_diari configurat.
     *   4. Les dates no poden solapar amb sol·licituds ja acceptades.
     */
    public function store(StoreTransactionRequest $request): JsonResponse
    {
        $validated = $request->validated();
        $user      = $request->user();

        $objecte = Objecte::findOrFail($validated['objecte_id']);

        // ── Regla 2: no pots sol·licitar el teu propi objecte ──
        if ($objecte->user_id === $user->id) {
            return response()->json([
                'message' => 'No puedes solicitar tu propio objeto.',
                'errors'  => ['objecte_id' => ['L\'objecte que sol·licites és teu.']],
            ], 422);
        }

        // ── Regla 3: si lloguer, l'objecte ha de tenir preu_diari ──
        if ($objecte->tipus === 'lloguer' && !$objecte->preu_diari) {
            return response()->json([
                'message' => 'Este objeto no tiene precio de alquiler configurado.',
                'errors'  => ['objecte_id' => ['L\'objecte no té preu_diari per a lloguer.']],
            ], 422);
        }

        // ── Regla 4: validar disponibilitat de dates ──
        $hiHaSolapament = Solicitud::ocupenDates(
            $objecte->id,
            $validated['data_inici'],
            $validated['data_fi']
        )->exists();

        if ($hiHaSolapament) {
            return response()->json([
                'message' => 'Las fechas seleccionadas no están disponibles.',
                'errors'  => [
                    'data_inici' => ['Hi ha una altra sol·licitud acceptada en aquestes dates.'],
                ],
            ], 422);
        }

        // ── Crear la sol·licitud (tipus derivat de l'objecte) ──
        $solicitud = DB::transaction(function () use ($validated, $user, $objecte) {
            return Solicitud::create([
                'solicitant_id' => $user->id,
                'objecte_id'    => $objecte->id,
                'data_inici'    => $validated['data_inici'],
                'data_fi'       => $validated['data_fi'],
                'tipus'         => $objecte->tipus,
                'missatge'      => $validated['missatge'] ?? null,
                'estat'         => 'pendent',
            ]);
        });

        $solicitud->load(['objecte.user', 'solicitant', 'transaccio']);

        return (new TransactionResource($solicitud))
            ->response()
            ->setStatusCode(201);
    }

    /**
     * PUT /api/v1/transactions/{id}/accept
     *
     * El propietari accepta la sol·licitud:
     *   1. Solicitud.estat: pendent --> acceptat
     *   2. Crea una Transaccio (estat 'en_curs')
     *   3. Marca l'objecte com no_disponible
     *
     */
    public function accept(int $id): JsonResponse
    {
        $solicitud = Solicitud::with(['objecte.user', 'solicitant', 'transaccio'])
            ->findOrFail($id);

        // Autorització: només propietari de l'objecte
        $this->authorize('accept', $solicitud);

        // Només es poden acceptar peticions pendents
        if ($solicitud->estat !== 'pendent') {
            return response()->json([
                'message' => 'Esta solicitud no se puede aceptar.',
                'errors'  => ['estat' => ["L'estat actual és '{$solicitud->estat}'."]],
            ], 422);
        }

        // Re-validar disponibilitat (algú altre podria haver acceptat
        // dates solapades mentrestant - race condition)
        $hiHaSolapament = Solicitud::ocupenDates(
            $solicitud->objecte_id,
            $solicitud->data_inici->toDateString(),
            $solicitud->data_fi->toDateString()
        )->where('id', '!=', $solicitud->id)->exists();

        if ($hiHaSolapament) {
            return response()->json([
                'message' => 'Las fechas ya no están disponibles.',
                'errors'  => [
                    'data_inici' => ['S\'ha acceptat una altra sol·licitud per aquestes dates.'],
                ],
            ], 422);
        }

        DB::transaction(function () use ($solicitud) {
            // 1. Actualitzar la sol·licitud
            $solicitud->update(['estat' => 'acceptat']);

            // 2. Crear la Transaccio
            $solicitud->transaccio()->create([
                'data_inici_real' => now(),
                'data_fi_real'    => null,
                'estat'           => 'en_curs',
            ]);

            // 3. Marcar l'objecte com no_disponible
            $solicitud->objecte()->update(['estat' => 'no_disponible']);
        });

        // Recarregar amb relacions actualitzades
        $solicitud->refresh()->load(['objecte.user', 'solicitant', 'transaccio']);

        return response()->json([
            'message' => 'Solicitud aceptada correctamente.',
            'data'    => new TransactionResource($solicitud),
        ], 200);
    }

    /**
     * PUT /api/v1/transactions/{id}/reject
     *
     * El propietari rebutja la sol·licitud.
     *   - Solicitud.estat: pendent --> rebutjat
     *   - L'objecte continua disponible
     *
     */
    public function reject(int $id): JsonResponse
    {
        $solicitud = Solicitud::with(['objecte.user', 'solicitant', 'transaccio'])
            ->findOrFail($id);

        $this->authorize('reject', $solicitud);

        if ($solicitud->estat !== 'pendent') {
            return response()->json([
                'message' => 'Esta solicitud no se puede rechazar.',
                'errors'  => ['estat' => ["El estado actual es '{$solicitud->estat}'."]],
            ], 422);
        }

        $solicitud->update(['estat' => 'rebutjat']);

        $solicitud->refresh()->load(['objecte.user', 'solicitant', 'transaccio']);

        return response()->json([
            'message' => 'Solicitud rechazada correctamente.',
            'data'    => new TransactionResource($solicitud),
        ], 200);
    }
}
