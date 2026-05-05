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
use App\Http\Requests\Api\V1\UpdateProximityRadiusRequest;
use Illuminate\Support\Facades\DB;

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
            return response()->json([
                'message' => 'Usuari no trobat.',
            ], 404);
        }

        $authUser = $request->user();
        $isOwn = $authUser && $authUser->id === $user->id;

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

        // Stats de valoració del propietari (mitjana + total)
        $stats = User::getValoracioStats($user->id);
        $user->valoracio_mitjana = $stats['avg'];
        $user->valoracio_total   = $stats['total'];

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
            return response()->json(['message' => 'No tens permís per editar aquest perfil.'], 403);
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
     * PUT /api/v1/user/proximity-radius
     *
     * Actualitza el radi de proximitat (en km, 1-50) de l'usuari autenticat.
     * S'utilitza com a default a /objects/nearby quan el client no envia radius.
     *
     */
    public function updateProximityRadius(UpdateProximityRadiusRequest $request): JsonResponse
    {
        $user = $request->user();

        $user->update([
            'radi_proximitat' => $request->validated('radi_proximitat'),
        ]);

        return response()->json([
            'message' => 'Radi de proximitat actualitzat correctament.',
            'data'    => [
                'user' => new UserResource($user->fresh()),
            ],
        ], 200);
    }
}
