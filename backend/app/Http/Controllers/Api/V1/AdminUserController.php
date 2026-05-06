<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\DB;

class AdminUserController extends Controller
{
    public function index(Request $request) {
        $users = User::orderByDesc('created_at')->get();

        return UserResource::collection($users);
    }

    public function block(Request $request, $id) {
        $user = User::find($id);
        if (!$user) {
            return response()->json([
                'message' => 'Usuari no trobat.',
            ], Response::HTTP_NOT_FOUND);
        }

        if ($request->user()->id === $user->id) {
            return response()->json([
                'message' => 'No pots bloquejar-te a tu mateix.',
            ], Response::HTTP_BAD_REQUEST);
        }

        if (! $user->actiu) {
            return response()->json([
                'message' => 'L\'usuari ja està bloquejat.',
            ], Response::HTTP_BAD_REQUEST);
        }

        $user->update(['actiu' => false]);
        $this->logAdminAction($request, 'block', $user, ['payload' => ['actiu' => false]]);

        return new UserResource($user->refresh());
    }

    public function unblock(Request $request, $id) {
        $user = User::find($id);
        if (!$user) {
            return response()->json([
                'message' => 'Usuari no trobat.',
            ], Response::HTTP_NOT_FOUND);
        }

        if ($request->user()->id === $user->id) {
            return response()->json([
                'message' => 'No pots desbloquejar-te a tu mateix.',
            ], Response::HTTP_BAD_REQUEST);
        }

        if ($user->actiu) {
            return response()->json([
                'message' => 'L\'usuari ja està actiu.',
            ], Response::HTTP_BAD_REQUEST);
        }

        $user->update(['actiu' => true]);
        $this->logAdminAction($request, 'unblock', $user, ['payload' => ['actiu' => true]]);

        return new UserResource($user->refresh());
    }

    public function destroy(Request $request, $id) {
        $user = User::find($id);
        if (!$user) {
            return response()->json([
                'message' => 'Usuari no trobat.',
            ], Response::HTTP_NOT_FOUND);
        }

        if ($request->user()->id === $user->id) {
            return response()->json([
                'message' => 'No pots eliminar-te a tu mateix.',
            ], Response::HTTP_BAD_REQUEST);
        }

        $user->delete();
        $this->logAdminAction($request, 'delete', $user, ['payload' => $user->toArray()]);

        return response()->json([
            'message' => 'Usuari eliminat correctament.',
            'id' => $user->id,
        ], Response::HTTP_OK);
    }

    protected function logAdminAction(Request $request, string $action, User $user, array $details = []): void {
        DB::table('logs')->insert([
            'user_id' => $request->user()->id,
            'tipus' => 'admin',
            'accio' => "user_{$action}",
            'detall' => json_encode($details),
            'entitat_afectada' => 'user',
            'id_entitat_afectada' => $user->id,
            'ip' => $request->ip(),
        ]);
    }
}
