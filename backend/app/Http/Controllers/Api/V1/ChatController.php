<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\StoreChatRequest;
use App\Http\Requests\Api\V1\StoreMessageRequest;
use App\Http\Resources\ConversaResource;
use App\Http\Resources\MissatgeResource;
use App\Models\Conversa;
use App\Models\Missatge;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ChatController extends Controller
{
    /**
     * GET /api/v1/chats
     *
     * Llista totes les converses on participa l'usuari, amb últim missatge
     * i el comptador de no llegits per la seva banda.
     * Ordre: per data de l'últim missatge (descendent), amb fallback updated_at.
     */
    public function index(Request $request): JsonResponse
    {
        $userId = $request->user()->id;

        $converses = Conversa::query()
            ->deUsuari($userId)
            ->with([
                'usuari1:id,username,nom,cognoms,avatar_url',
                'usuari2:id,username,nom,cognoms,avatar_url',
                'objecte:id,nom,slug',
                'ultimMissatge',
            ])
            ->withCount(['missatges as missatges_no_llegits_count' => function ($q) use ($userId) {
                $q->where('emissor_id', '!=', $userId)
                    ->whereNull('llegit_at');
            }])
            // Ordre per últim missatge — subselect a la mateixa taula
            ->orderByDesc(
                Missatge::select('created_at')
                    ->whereColumn('conversa_id', 'converses.id')
                    ->orderByDesc('created_at')
                    ->limit(1)
            )
            ->orderByDesc('updated_at')
            ->get();

        return response()->json([
            'data' => ConversaResource::collection($converses),
        ]);
    }

    /**
     * POST /api/v1/chats
     *
     * Crea (o recupera) la conversa entre l'usuari autenticat i un altre.
     * Body: { user_id, objecte_id?, missatge? }
     *
     * Si la conversa ja existia es retorna sense modificar el seu objecte_id.
     * Si s'envia missatge, es crea com a primer (o nou) missatge.
     */
    public function store(StoreChatRequest $request): JsonResponse
    {
        $validated = $request->validated();
        $userId    = $request->user()->id;

        $conversa = DB::transaction(function () use ($validated, $userId) {
            $conversa = Conversa::firstOrCreateForPair(
                $userId,
                (int) $validated['user_id'],
                $validated['objecte_id'] ?? null
            );

            if (!empty($validated['missatge'])) {
                Missatge::create([
                    'conversa_id' => $conversa->id,
                    'emissor_id'  => $userId,
                    'contingut'   => $validated['missatge'],
                ]);
                $conversa->touch();
            }

            return $conversa;
        });

        $conversa->load([
            'usuari1:id,username,nom,cognoms,avatar_url',
            'usuari2:id,username,nom,cognoms,avatar_url',
            'objecte:id,nom,slug',
            'ultimMissatge',
        ]);

        return (new ConversaResource($conversa))
            ->response()
            ->setStatusCode(201);
    }

    /**
     * GET /api/v1/chats/{id}
     *
     * Detall d'una conversa concreta (sense missatges, només participants i context).
     */
    public function show(Request $request, int $id): JsonResponse
    {
        $userId = $request->user()->id;

        $conversa = Conversa::with([
            'usuari1:id,username,nom,cognoms,avatar_url',
            'usuari2:id,username,nom,cognoms,avatar_url',
            'objecte:id,nom,slug',
            'ultimMissatge',
        ])->findOrFail($id);

        if (!$conversa->teParticipant($userId)) {
            return response()->json(['message' => 'No tens accés a aquesta conversa.'], 403);
        }

        return response()->json([
            'data' => new ConversaResource($conversa),
        ]);
    }

    /**
     * GET /api/v1/chats/{id}/messages
     *
     * Retorna els missatges paginats. La pàgina 1 conté els N últims; el
     * frontend pot scrollar enrere demanant pàgines següents.
     */
    public function messages(Request $request, int $id): JsonResponse
    {
        $userId   = $request->user()->id;
        $conversa = Conversa::findOrFail($id);

        if (!$conversa->teParticipant($userId)) {
            return response()->json(['message' => 'No tens accés a aquesta conversa.'], 403);
        }

        $perPage = min((int) $request->input('per_page', 50), 100);

        $paginator = $conversa->missatges()
            ->orderByDesc('created_at')
            ->paginate($perPage);

        // El frontend els vol antics → recents per renderitzar de dalt a baix
        $ordenats = $paginator->getCollection()->reverse()->values();

        return response()->json([
            'data' => MissatgeResource::collection($ordenats),
            'meta' => [
                'current_page' => $paginator->currentPage(),
                'last_page'    => $paginator->lastPage(),
                'per_page'     => $paginator->perPage(),
                'total'        => $paginator->total(),
            ],
        ]);
    }

    /**
     * POST /api/v1/chats/{id}/messages
     *
     * Envia un missatge a la conversa. L'emissor és l'usuari autenticat.
     */
    public function sendMessage(StoreMessageRequest $request, int $id): JsonResponse
    {
        $userId   = $request->user()->id;
        $conversa = Conversa::findOrFail($id);

        if (!$conversa->teParticipant($userId)) {
            return response()->json(['message' => 'No tens accés a aquesta conversa.'], 403);
        }

        $missatge = DB::transaction(function () use ($conversa, $userId, $request) {
            $m = Missatge::create([
                'conversa_id' => $conversa->id,
                'emissor_id'  => $userId,
                'contingut'   => $request->validated('contingut'),
            ]);
            $conversa->touch();
            return $m;
        });

        return (new MissatgeResource($missatge))
            ->response()
            ->setStatusCode(201);
    }

    /**
     * PUT /api/v1/chats/{id}/read
     *
     * Marca tots els missatges no propis com a llegits (llegit_at = now()).
     * Idempotent — només actualitza els que encara són null.
     */
    public function markAsRead(Request $request, int $id): JsonResponse
    {
        $userId   = $request->user()->id;
        $conversa = Conversa::findOrFail($id);

        if (!$conversa->teParticipant($userId)) {
            return response()->json(['message' => 'No tens accés a aquesta conversa.'], 403);
        }

        $afectats = $conversa->missatges()
            ->where('emissor_id', '!=', $userId)
            ->whereNull('llegit_at')
            ->update(['llegit_at' => now()]);

        return response()->json([
            'message' => 'Missatges marcats com a llegits.',
            'updated' => $afectats,
        ]);
    }
}
