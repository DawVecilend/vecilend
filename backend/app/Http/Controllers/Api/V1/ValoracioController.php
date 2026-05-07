<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\StoreValoracioRequest;
use App\Models\Solicitud;
use App\Models\User;
use App\Models\Valoracio;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\Notificacio;

class ValoracioController extends Controller
{
    /**
     * POST /api/v1/transactions/{id}/review
     *
     * Crea una valoració associada a una transacció finalitzada.
     * L'usuari autenticat és l'autor; el valorat és l'altre participant.
     *
     * Validacions:
     *   1. La transacció ha d'estar finalitzada.
     *   2. L'autor ha de ser participant (sol·licitant o propietari).
     *   3. No pot existir ja una valoració d'aquest autor sobre aquesta transacció.
     */
    public function store(StoreValoracioRequest $request, int $transactionId): JsonResponse
    {
        $solicitud = Solicitud::with(['objecte:id,user_id', 'transaccio'])
            ->whereHas('transaccio', fn($q) => $q->where('id', $transactionId))
            ->first();

        if (!$solicitud) {
            return response()->json(['message' => 'Transacció no trobada.'], 404);
        }

        $transaccio = $solicitud->transaccio;
        $user       = $request->user();

        // ── Regla 1: estat de la transacció ──
        if ($transaccio->estat !== 'finalitzat') {
            return response()->json([
                'message' => 'Només pots valorar després de la devolució.',
                'errors'  => ['estat' => ["L'estat actual de la transacció és '{$transaccio->estat}'."]],
            ], 422);
        }

        // ── Regla 2: l'autor ha de ser participant ──
        $solicitantId = $solicitud->solicitant_id;
        $propietariId = $solicitud->objecte->user_id;

        if ($user->id !== $solicitantId && $user->id !== $propietariId) {
            return response()->json([
                'message' => 'No participes en aquesta transacció.',
            ], 403);
        }

        $valoratId = $user->id === $solicitantId ? $propietariId : $solicitantId;

        // ── Regla 3: no duplicat ──
        $existeix = Valoracio::where('transaccio_id', $transaccio->id)
            ->where('autor_id', $user->id)
            ->exists();

        if ($existeix) {
            return response()->json([
                'message' => 'Ja has valorat aquesta transacció.',
                'errors'  => ['transaccio_id' => ['Ja existeix una valoració teva en aquesta transacció.']],
            ], 422);
        }

        // ── Crear ──
        $valoracio = DB::transaction(function () use ($request, $transaccio, $user, $valoratId, $solicitud) {
            $v = Valoracio::create([
                'transaccio_id' => $transaccio->id,
                'autor_id'      => $user->id,
                'valorat_id'    => $valoratId,
                'objecte_id'    => $solicitud->objecte_id,
                'puntuacio'     => $request->validated('puntuacio'),
                'comentari'     => $request->validated('comentari'),
                'created_at'    => now(),
            ]);

            Notificacio::create([
                'user_id'                 => $valoratId,
                'tipus'                   => Notificacio::TIPUS_VALORACIO_REBUDA,
                'titol'                   => 'Nueva valoración',
                'missatge'                => "{$user->nom} te ha dejado una valoración de {$v->puntuacio}/5.",
                'entitat_referenciada'    => 'valoracio',
                'id_entitat_referenciada' => $v->id,
            ]);

            return $v;
        });

        return response()->json([
            'message' => 'Valoració registrada correctament.',
            'data'    => [
                'id'            => $valoracio->id,
                'transaccio_id' => $valoracio->transaccio_id,
                'autor_id'      => $valoracio->autor_id,
                'valorat_id'    => $valoracio->valorat_id,
                'objecte_id'    => $valoracio->objecte_id,
                'puntuacio'     => $valoracio->puntuacio,
                'comentari'     => $valoracio->comentari,
                'created_at'    => $valoracio->created_at?->toIso8601String(),
            ],
        ], 201);
    }

    /**
     * GET /api/v1/users/{username}/reviews?role=propietari|solicitant&page=N
     *
     * Llista paginada de valoracions rebudes per un usuari, filtrables per rol.
     * Inclou objecte, autor i metadades de paginació + stats globals (avg + total).
     */
    public function userReviews(Request $request, string $username): JsonResponse
    {
        $request->validate([
            'role'     => ['nullable', 'string', 'in:propietari,solicitant,qualsevol'],
            'page'     => ['nullable', 'integer', 'min:1'],
            'per_page' => ['nullable', 'integer', 'min:1', 'max:30'],
        ]);

        $user = User::where('username', $username)->first();
        if (!$user) {
            return response()->json(['message' => 'Usuari no trobat.'], 404);
        }

        $rol     = $request->input('role', 'qualsevol');
        $perPage = (int) $request->input('per_page', 5);

        $query = Valoracio::query()
            ->where('valorat_id', $user->id)
            ->with([
                'autor:id,username,nom,cognoms,avatar_url',
                'objecte:id,nom,slug,user_id',
            ]);

        if ($rol === 'propietari') {
            $query->whereExists(function ($q) {
                $q->select(DB::raw(1))
                    ->from('objectes')
                    ->whereColumn('objectes.id', 'valoracions.objecte_id')
                    ->whereColumn('objectes.user_id', 'valoracions.valorat_id');
            });
        } elseif ($rol === 'solicitant') {
            $query->whereExists(function ($q) {
                $q->select(DB::raw(1))
                    ->from('objectes')
                    ->whereColumn('objectes.id', 'valoracions.objecte_id')
                    ->whereColumn('objectes.user_id', '!=', 'valoracions.valorat_id');
            });
        }

        $paginator = $query->orderByDesc('created_at')->paginate($perPage);

        // Stats globals (independents de la paginació)
        $stats = Valoracio::statsUsuari($user->id, $rol);

        return response()->json([
            'data' => $paginator->getCollection()->map(fn(Valoracio $v) => [
                'id'         => $v->id,
                'puntuacio'  => $v->puntuacio,
                'comentari'  => $v->comentari,
                'created_at' => $v->created_at?->toIso8601String(),
                'autor'      => $v->autor ? [
                    'id'         => $v->autor->id,
                    'username'   => $v->autor->username,
                    'nom'        => $v->autor->nom,
                    'cognoms'    => $v->autor->cognoms,
                    'avatar_url' => $v->autor->avatar_url,
                ] : null,
                'objecte'    => $v->objecte ? [
                    'id'   => $v->objecte->id,
                    'nom'  => $v->objecte->nom,
                    'slug' => $v->objecte->slug,
                ] : null,
            ])->values(),
            'meta' => [
                'current_page' => $paginator->currentPage(),
                'last_page'    => $paginator->lastPage(),
                'per_page'     => $paginator->perPage(),
                'total'        => $paginator->total(),
                'avg'          => $stats['avg'],
            ],
        ]);
    }

    /**
     * GET /api/v1/users/{username}/reviews/evolution
     *
     * Sèries temporals per als gràfics del perfil.
     * Retorna dues llistes (propietari, solicitant) amb [{n, puntuacio, created_at}] ordenades per data.
     */
    public function evolution(string $username): JsonResponse
    {
        $user = User::where('username', $username)->first();
        if (!$user) {
            return response()->json(['message' => 'Usuari no trobat.'], 404);
        }

        $serie = function (string $rol) use ($user) {
            $query = Valoracio::query()->where('valorat_id', $user->id);

            if ($rol === 'propietari') {
                $query->whereExists(function ($q) {
                    $q->select(DB::raw(1))
                        ->from('objectes')
                        ->whereColumn('objectes.id', 'valoracions.objecte_id')
                        ->whereColumn('objectes.user_id', 'valoracions.valorat_id');
                });
            } else {
                $query->whereExists(function ($q) {
                    $q->select(DB::raw(1))
                        ->from('objectes')
                        ->whereColumn('objectes.id', 'valoracions.objecte_id')
                        ->whereColumn('objectes.user_id', '!=', 'valoracions.valorat_id');
                });
            }

            return $query
                ->orderBy('created_at')
                ->get(['puntuacio', 'created_at'])
                ->values()
                ->map(fn($v, $idx) => [
                    'n'          => $idx + 1,
                    'puntuacio'  => (int) $v->puntuacio,
                    'created_at' => $v->created_at?->toIso8601String(),
                ]);
        };

        return response()->json([
            'data' => [
                'propietari' => $serie('propietari'),
                'solicitant' => $serie('solicitant'),
            ],
        ]);
    }
}
