<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use App\Http\Requests\Api\V1\UpdateProfileRequest;
use App\Http\Requests\Api\V1\UpdatePasswordRequest;
use App\Models\User;
use App\Services\CloudinaryService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Http\Requests\Api\V1\DeleteAccountRequest;
use App\Models\Solicitud;

class UserController extends Controller
{
    protected $cloudinaryService;

    public function __construct(CloudinaryService $cloudinaryService)
    {
        $this->cloudinaryService = $cloudinaryService;
    }

    public function getByUsername(Request $request, $username)
    {
        $user = User::where('username', $username)->first();
        if (!$user) {
            return response()->json(['message' => 'Usuario no encontrado.'], 404);
        }

        $authUser = $request->user();
        $isOwn    = $authUser && $authUser->id === $user->id;

        if (!$user->actiu && !$isOwn) {
            return response()->json(['message' => 'Usuario no encontrado.'], 404);
        }

        // Query base dels objectes del usuari
        $latestObjectsQuery = \App\Models\Objecte::query()
            ->ambCoordenades()
            ->where('user_id', $user->id)
            ->with([
                'user:id,nom,username,avatar_url',
                'categoria:id,nom,icona',
                'subcategoria:id,nom,slug',
                'imatges',
            ])
            ->orderByDesc('created_at')
            ->limit(5);

        // Si NO és el propietari, només retorna disponibles
        if (!$isOwn) {
            $latestObjectsQuery->where('estat', 'disponible');
        }

        $latestObjects = $latestObjectsQuery->get();
        $objecteIds = $latestObjects->pluck('id')->all();
        $statsPerObjecte = \App\Models\Valoracio::statsPropietariPerObjectesBulk($objecteIds);
        foreach ($latestObjects as $objecte) {
            $stats = $statsPerObjecte[$objecte->id] ?? ['avg' => null, 'total' => 0];
            $objecte->valoracions_objecte_avg   = $stats['avg'];
            $objecte->valoracions_objecte_total = $stats['total'];
        }

        // Stats com a propietari + sol·licitant (mitjana ponderada per temps)
        $statsPropietari = User::statsComPropietari($user->id);
        $statsSolicitant = User::statsComSolicitant($user->id);

        $user->valoracio_propietari_avg   = $statsPropietari['avg'];
        $user->valoracio_propietari_total = $statsPropietari['total'];
        $user->valoracio_solicitant_avg   = $statsSolicitant['avg'];
        $user->valoracio_solicitant_total = $statsSolicitant['total'];

        $user->total_transaccions = User::totalTransaccions($user->id);
        $user->resposta_rate      = User::calcularRespostaRate($user->id);

        // Triem el resource segons si és el propietari
        $resourceClass = $isOwn
            ? UserResource::class
            : \App\Http\Resources\PublicUserResource::class;

        return (new $resourceClass($user))
            ->additional([
                'latest_objects' => \App\Http\Resources\ObjecteResource::collection($latestObjects),
            ]);
    }

    public function update(UpdateProfileRequest $request, $username)
    {
        $user = User::where('username', $username)->firstOrFail();

        if ($request->user()->id !== $user->id) {
            return response()->json(['message' => 'No tienes permiso para editar este perfil.'], 403);
        }

        $data = $request->validated();

        // ── 1. Avatar (si s'envia) ──
        if ($request->hasFile('avatar')) {
            if ($user->avatar_public_id) {
                $this->cloudinaryService->delete($user->avatar_public_id);
            }
            $upload = $this->cloudinaryService->upload($request->file('avatar'), 'vecilend/avatars');
            $data['avatar_url']       = $upload['url'];
            $data['avatar_public_id'] = $upload['public_id'];
        }

        // ── 2. Coordenades (si s'envien) — UPDATE raw per PostGIS ──
        $ubicacio = $data['ubicacio'] ?? null;
        unset($data['ubicacio']); // No la passem al ->update() normal

        // ── 3. Camps normals ──
        $user->update($data);

        // ── 4. Si hi ha coordenades, fem l'UPDATE raw ──
        if ($ubicacio && isset($ubicacio['lat'], $ubicacio['lng'])) {
            DB::statement(
                'UPDATE users SET ubicacio = ST_SetSRID(ST_MakePoint(?, ?), 4326)::geography WHERE id = ?',
                [$ubicacio['lng'], $ubicacio['lat'], $user->id]
            );
            $user->refresh();
        }

        return new UserResource($user);
    }

    public function updatePassword(UpdatePasswordRequest $request): JsonResponse
    {
        $user = $request->user();

        $user->update([
            'password' => Hash::make($request->validated('password')),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Contraseña actualizada correctamente.'
        ], 200);
    }

    /**
     * DELETE /api/v1/account
     *
     * Elimina la pròpia compte de l'usuari autenticat.
     *
     * Comprovacions:
     *   1. La contrasenya s'ha verificat al FormRequest.
     *   2. L'usuari no pot tenir transaccions actives (estat 'en_curs') ni
     *      com a solicitant ni com a propietari, per evitar deixar trànsits
     *      a mitges.
     *
     * Cascada:
     *   - users → cascadeOnDelete a objectes, solicituds, missatges, favorits,
     *     notificacions, valoracions (segons les FK existents).
     *   - Pagaments queden lligats a la transacció orfe; com que la transacció
     *     mateixa s'esborra (FK cascade des de solicituds), els pagaments també.
     *   - Cloudinary: borrem avatar abans, i les imatges d'objectes les netegem
     *     seguint la mateixa lògica que a `ObjecteController::destroy`.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroyAccount(DeleteAccountRequest $request)
    {
        $user = $request->user();

        // ── 1. Bloquejos: transaccions en curs ───────────────────────────
        $teTransaccionsActives = Solicitud::query()
            ->whereHas('transaccio', fn($q) => $q->where('estat', 'en_curs'))
            ->where(function ($q) use ($user) {
                $q->where('solicitant_id', $user->id)
                    ->orWhereHas('objecte', fn($oq) => $oq->where('user_id', $user->id));
            })
            ->exists();

        if ($teTransaccionsActives) {
            return response()->json([
                'message' => 'No puedes eliminar la cuenta mientras tengas transacciones en curso. Resuélvelas primero (cancelar o devolver el objeto).',
            ], 422);
        }

        // ── 2. Cloudinary cleanup ──────────────────────────────────────
        try {
            if ($user->avatar_public_id) {
                $this->cloudinaryService->delete($user->avatar_public_id);
            }
            // Esborrar imatges Cloudinary de cada objecte propi
            $publicIds = DB::table('imatges_objecte')
                ->join('objectes', 'objectes.id', '=', 'imatges_objecte.objecte_id')
                ->where('objectes.user_id', $user->id)
                ->pluck('imatges_objecte.public_id_cloudinary')
                ->all();

            foreach ($publicIds as $pid) {
                try {
                    $this->cloudinaryService->delete($pid);
                } catch (\Throwable $e) {
                    Log::warning("No s'ha pogut esborrar imatge Cloudinary: {$pid} ({$e->getMessage()})");
                }
            }
        } catch (\Throwable $e) {
            Log::warning("Error netejant Cloudinary durant DELETE account: {$e->getMessage()}");
            // No bloquegem el delete per culpa de Cloudinary
        }

        // ── 3. Tokens de Sanctum: revoquem els actius ──────────────────
        $user->tokens()->delete();

        // ── 4. Delete (cascada s'encarrega de la resta) ────────────────
        $user->delete();

        return response()->json([
            'message' => 'Cuenta eliminada correctamente.',
        ], 200);
    }

    /**
     * PUT /api/v1/account/deactivate
     *
     * Marca el compte com a inactiu. A diferència de destroyAccount,
     * NO esborra dades: només posa actiu=false i revoca els tokens.
     * L'usuari pot reactivar contactant amb suport (o, si ho volem
     * més endavant, fent login que canvii actiu=true automàticament).
     */
    public function deactivateAccount(Request $request)
    {
        $user = $request->user();

        // Si té transaccions en curs no permetem desactivar (igual que destroyAccount)
        $teTransaccionsActives = Solicitud::query()
            ->whereHas('transaccio', fn($q) => $q->where('estat', 'en_curs'))
            ->where(function ($q) use ($user) {
                $q->where('solicitant_id', $user->id)
                    ->orWhereHas('objecte', fn($oq) => $oq->where('user_id', $user->id));
            })
            ->exists();

        if ($teTransaccionsActives) {
            return response()->json([
                'message' => 'No puedes desactivar la cuenta mientras tengas transacciones en curso. Resuélvelas primero.',
            ], 422);
        }

        $user->update(['actiu' => false]);
        $user->tokens()->delete();

        return response()->json([
            'message' => 'Cuenta desactivada correctamente.',
        ], 200);
    }
}
