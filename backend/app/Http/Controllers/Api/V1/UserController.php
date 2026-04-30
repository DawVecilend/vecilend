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

class UserController extends Controller
{
    protected $cloudinaryService;

    public function __construct(CloudinaryService $cloudinaryService)
    {
        $this->cloudinaryService = $cloudinaryService;
    }

    public function getByUsername($username)
    {
        $user = User::with(['objectes' => function ($query) {
            $query->orderByDesc('created_at')->limit(3);
        }])->where('username', $username)->first();

        if (!$user) {
            return response()->json([
                'message' => 'Usuari no trobat.',
            ], 404);
        }

        return new UserResource($user);
    }

    public function update(UpdateProfileRequest $request, $username)
    {
        $user = User::where('username', $username)->firstOrFail();

        if ($request->user()->id !== $user->id) {
            return response()->json(['message' => 'No tens permís per editar aquest perfil.'], 403);
        }

        $data = $request->validated();

        if ($request->hasFile('avatar')) {
            if ($user->avatar_public_id) {
                $this->cloudinaryService->delete($user->avatar_public_id);
            }

            $upload = $this->cloudinaryService->upload($request->file('avatar'), 'vecilend/avatars');
            $data['avatar_url'] = $upload['url'];
            $data['avatar_public_id'] = $upload['public_id'];
        }

        $user->update($data);

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
