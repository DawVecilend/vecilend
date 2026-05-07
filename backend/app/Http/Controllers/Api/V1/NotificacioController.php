<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\NotificacioResource;
use App\Models\Notificacio;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class NotificacioController extends Controller
{
    /**
     * GET /api/v1/notifications
     *
     * Llista paginada de notificacions de l'usuari (recents primer).
     */
    public function index(Request $request): JsonResponse
    {
        $userId  = $request->user()->id;
        $perPage = min((int) $request->input('per_page', 20), 50);

        $paginator = Notificacio::where('user_id', $userId)
            ->orderByDesc('created_at')
            ->paginate($perPage);

        return response()->json([
            'data' => NotificacioResource::collection($paginator->getCollection()),
            'meta' => [
                'current_page' => $paginator->currentPage(),
                'last_page'    => $paginator->lastPage(),
                'per_page'     => $paginator->perPage(),
                'total'        => $paginator->total(),
            ],
        ]);
    }

    /**
     * PUT /api/v1/notifications/{id}/read
     */
    public function markAsRead(Request $request, int $id): JsonResponse
    {
        $userId = $request->user()->id;
        $notif  = Notificacio::where('user_id', $userId)->findOrFail($id);

        if (!$notif->llegida) {
            $notif->update(['llegida' => true]);
        }

        return response()->json([
            'message' => 'Notificació marcada com a llegida.',
            'data'    => new NotificacioResource($notif),
        ]);
    }

    /**
     * PUT /api/v1/notifications/read-all
     */
    public function markAllAsRead(Request $request): JsonResponse
    {
        $userId   = $request->user()->id;
        $afectats = Notificacio::where('user_id', $userId)
            ->where('llegida', false)
            ->update(['llegida' => true]);

        return response()->json([
            'message' => 'Totes les notificacions marcades com a llegides.',
            'updated' => $afectats,
        ]);
    }

    /**
     * DELETE /api/v1/notifications/{id}
     */
    public function destroy(Request $request, int $id): JsonResponse
    {
        $userId = $request->user()->id;
        $notif  = Notificacio::where('user_id', $userId)->findOrFail($id);
        $notif->delete();

        return response()->json([
            'message' => 'Notificació eliminada.',
        ]);
    }
}
