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
use App\Models\Conversa;
use App\Models\Missatge;
use App\Models\Notificacio;

class TransactionController extends Controller
{
    /**
     * GET /api/v1/transactions?role=&status=&objecte_id=
     *
     * Llista les sol·licituds en què participa l'usuari autenticat.
     * 
     * Filtres:
     *   - role: 'requester' (les que l'usuari ha fet) | 'owner' (les que l'usuari ha rebut com a propietari)
     *           Si s'omet, retorna les dues llistes barrejades.
     *   - status: 'pendent' | 'acceptat' | 'rebutjat' | 'finalitzat'
     *   - objecte_id: Filtra les sol·licituds per un objecte específic (si s'omet, es mostren totes les sol·licituds).
     *
     * Ordre: més recents primer.
     */
    public function index(Request $request)
    {
        $request->validate([
            'role'       => ['nullable', 'string', 'in:requester,owner'],
            'status'     => ['nullable', 'string', 'in:pendent,acceptat,rebutjat,finalitzat'],
            'objecte_id' => ['nullable', 'integer', 'exists:objectes,id'],
            'per_page'   => ['nullable', 'integer', 'min:1', 'max:30'],
            'page'       => ['nullable', 'integer', 'min:1'],
        ]);

        $user = $request->user();
        $role = $request->input('role');

        $query = Solicitud::with([
            'objecte.user:id,username,nom,cognoms,avatar_url',
            'objecte.imatges',
            'solicitant:id,username,nom,cognoms,avatar_url',
            'transaccio',
        ]);

        if ($role === 'requester') {
            $query->where('solicitant_id', $user->id);
        } elseif ($role === 'owner') {
            $query->whereHas('objecte', fn($q) => $q->where('user_id', $user->id));
        } else {
            $query->where(function ($q) use ($user) {
                $q->where('solicitant_id', $user->id)
                    ->orWhereHas('objecte', fn($oq) => $oq->where('user_id', $user->id));
            });
        }

        if ($request->filled('status')) {
            $query->where('estat', $request->input('status'));
        }

        if ($request->filled('objecte_id')) {
            $query->where('objecte_id', $request->input('objecte_id'));
        }

        $perPage = (int) $request->input('per_page', 8);

        $solicituds = $query->orderByDesc('created_at')->paginate($perPage);

        return TransactionResource::collection($solicituds);
    }

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

        // ── Regla 1: no pots sol·licitar el teu propi objecte ──
        if ($objecte->user_id === $user->id) {
            return response()->json([
                'message' => 'No puedes solicitar tu propio objeto.',
                'errors'  => ['objecte_id' => ['L\'objecte que sol·licites és teu.']],
            ], 422);
        }

        // ── Regla 2: si és lloguer, l'objecte ha de tenir preu_diari ──
        if ($objecte->tipus === 'lloguer' && !$objecte->preu_diari) {
            return response()->json([
                'message' => 'Este objeto no tiene precio de alquiler configurado.',
                'errors'  => ['objecte_id' => ['L\'objecte no té preu_diari per a lloguer.']],
            ], 422);
        }

        // ── Regla 3: no es pot tenir més d'una sol·licitud pendent del mateix usuari ──
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
            $solicitud = Solicitud::create([
                'solicitant_id' => $user->id,
                'objecte_id'    => $objecte->id,
                'data_inici'    => $validated['data_inici'],
                'data_fi'       => $validated['data_fi'],
                'tipus'         => $objecte->tipus,
                'missatge'      => $validated['missatge'] ?? null,
                'estat'         => 'pendent',
            ]);

            // ── Notificació al propietari ──
            Notificacio::create([
                'user_id'                 => $objecte->user_id,
                'tipus'                   => Notificacio::TIPUS_SOLICITUD_REBUDA,
                'titol'                   => 'Nueva solicitud',
                'missatge'                => "{$user->nom} ha solicitado tu objeto «{$objecte->nom}».",
                'entitat_referenciada'    => 'solicitud',
                'id_entitat_referenciada' => $solicitud->id,
            ]);

            // ── Si hi ha missatge → crear/recuperar conversa i afegir-l'hi ──
            if (!empty($solicitud->missatge)) {
                $conversa = Conversa::firstOrCreateForPair(
                    $user->id,
                    $objecte->user_id,
                    $objecte->id
                );

                Missatge::create([
                    'conversa_id' => $conversa->id,
                    'emissor_id'  => $user->id,
                    'contingut'   => $solicitud->missatge,
                ]);

                $conversa->touch();
            }

            return $solicitud;
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

            // 4. Notificació al sol·licitant
            Notificacio::create([
                'user_id'                 => $solicitud->solicitant_id,
                'tipus'                   => Notificacio::TIPUS_SOLICITUD_ACCEPTADA,
                'titol'                   => 'Solicitud aceptada',
                'missatge'                => "Tu solicitud para «{$solicitud->objecte->nom}» ha sido aceptada.",
                'entitat_referenciada'    => 'solicitud',
                'id_entitat_referenciada' => $solicitud->id,
            ]);
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

        Notificacio::create([
            'user_id'                 => $solicitud->solicitant_id,
            'tipus'                   => Notificacio::TIPUS_SOLICITUD_REBUTJADA,
            'titol'                   => 'Solicitud rechazada',
            'missatge'                => "Tu solicitud para «{$solicitud->objecte->nom}» ha sido rechazada.",
            'entitat_referenciada'    => 'solicitud',
            'id_entitat_referenciada' => $solicitud->id,
        ]);

        $solicitud->refresh()->load(['objecte.user', 'solicitant', 'transaccio']);

        return response()->json([
            'message' => 'Solicitud rechazada correctamente.',
            'data'    => new TransactionResource($solicitud),
        ], 200);
    }

    /**
     * PUT /api/v1/transactions/{id}/return
     *
     * El propietari registra que ha rebut l'objecte de tornada.
     *   - Transaccio.estat: en_curs --> finalitzat
     *   - Transaccio.data_fi_real = ara
     *   - Solicitud.estat: acceptat --> finalitzat
     *   - Objecte.estat: no_disponible --> disponible
     *
     */
    public function returnObject(int $id): JsonResponse
    {
        $solicitud = Solicitud::with(['objecte.user', 'solicitant', 'transaccio'])
            ->findOrFail($id);

        $this->authorize('returnObject', $solicitud);

        // Ha d'estar acceptada amb una transacció en curs
        if ($solicitud->estat !== 'acceptat') {
            return response()->json([
                'message' => 'Esta transacción no está en curso.',
                'errors'  => ['estat' => ["L'estat actual és '{$solicitud->estat}'."]],
            ], 422);
        }

        $transaccio = $solicitud->transaccio;

        if (!$transaccio || $transaccio->estat !== 'en_curs') {
            return response()->json([
                'message' => 'No hay transacción activa para esta solicitud.',
                'errors'  => ['transaccio' => ['No s\'ha trobat la transacció associada o no està en curs.']],
            ], 422);
        }

        DB::transaction(function () use ($solicitud, $transaccio) {
            // 1. Tancar la transacció
            $transaccio->update([
                'data_fi_real' => now(),
                'estat'        => 'finalitzat',
            ]);

            // 2. Marcar la sol·licitud com finalitzada (per facilitar queries)
            $solicitud->update(['estat' => 'finalitzat']);

            // 3. Tornar a marcar l'objecte com disponible
            $solicitud->objecte()->update(['estat' => 'disponible']);
        });

        $solicitud->refresh()->load(['objecte.user', 'solicitant', 'transaccio']);

        return response()->json([
            'message' => 'Devolución registrada correctamente.',
            'data'    => new TransactionResource($solicitud),
        ], 200);
    }
}
