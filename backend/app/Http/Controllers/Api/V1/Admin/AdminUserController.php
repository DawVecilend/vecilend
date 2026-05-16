<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use App\Mail\AccountBlockedMail;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class AdminUserController extends Controller
{
    public function index(Request $request)
    {
        $users = User::orderByDesc('created_at')->get();
        return UserResource::collection($users);
    }

    public function block(Request $request, $id)
    {
        $validated = $request->validate([
            'motiu' => 'nullable|string|max:500',
        ]);

        $user = User::find($id);
        if (!$user) {
            return response()->json(['message' => 'Usuario no encontrado.'], Response::HTTP_NOT_FOUND);
        }
        if (!$user->actiu) {
            return response()->json(['message' => 'El usuario ya está bloqueado.'], Response::HTTP_BAD_REQUEST);
        }
        $user->update(['actiu' => false]);
        $this->logAdminAction($request, 'block', $user, [
            'payload' => ['actiu' => false],
            'motiu'   => $validated['motiu'] ?? null,
        ]);

        // Enviar email de bloqueo
        try {
            Mail::to($user->email)->send(new AccountBlockedMail(
                $user->nom,
                $validated['motiu'] ?? null,
                null
            ));
        } catch (\Throwable $e) {
            Log::warning('No se pudo enviar el email de bloqueo', [
                'user_id' => $user->id,
                'error'   => $e->getMessage(),
            ]);
        }

        return new UserResource($user->refresh());
    }

    public function unblock(Request $request, $id)
    {
        $user = User::find($id);
        if (!$user) {
            return response()->json(['message' => 'Usuario no encontrado.'], Response::HTTP_NOT_FOUND);
        }
        if ($user->actiu) {
            return response()->json(['message' => 'El usuario ya está activo.'], Response::HTTP_BAD_REQUEST);
        }
        $user->update(['actiu' => true]);
        $this->logAdminAction($request, 'unblock', $user, ['payload' => ['actiu' => true]]);
        return new UserResource($user->refresh());
    }

    public function destroy(Request $request, $id)
    {
        $user = User::find($id);
        if (!$user) {
            return response()->json(['message' => 'Usuario no encontrado.'], Response::HTTP_NOT_FOUND);
        }
        $userData = $user->only(['id', 'username', 'email', 'nom', 'cognoms']);
        $user->delete();
        $this->logAdminAction($request, 'delete', (object)['id' => $userData['id']], ['payload' => $userData]);
        return response()->json([
            'message' => 'Usuario eliminado correctamente.',
            'id'      => $userData['id'],
        ], Response::HTTP_OK);
    }

    protected function logAdminAction(Request $request, string $action, $user, array $details = []): void
    {
        DB::table('logs')->insert([
            'user_id'    => null,
            'empleat_id' => $request->user()->id,
            'tipus'      => 'admin',
            'accio'      => "user_{$action}",
            'detall'     => json_encode($details),
            'entitat_afectada'    => 'user',
            'id_entitat_afectada' => $user->id,
            'ip'         => $request->ip(),
            'created_at' => now(),
        ]);
    }
}
