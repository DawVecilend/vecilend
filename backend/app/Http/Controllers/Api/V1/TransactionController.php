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
}
