<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\StoreEmpleatRequest;
use App\Http\Requests\Api\V1\UpdateEmpleatRequest;
use App\Http\Resources\EmpleatResource;
use App\Models\Empleat;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\DB;

class AdminEmpleatController extends Controller
{
    public function index(Request $request)
    {
        $request->validate([
            'search'   => 'nullable|string|max:100',
            'rol'      => 'nullable|string|in:all,admin,suport',
            'per_page' => 'nullable|integer|min:1|max:100',
            'page'     => 'nullable|integer|min:1',
        ]);

        $query = Empleat::query()->orderByDesc('created_at');

        if ($request->filled('search')) {
            $q = '%' . strtolower($request->input('search')) . '%';
            $query->where(function ($w) use ($q) {
                $w->whereRaw('LOWER(nom) LIKE ?', [$q])
                    ->orWhereRaw('LOWER(cognoms) LIKE ?', [$q])
                    ->orWhereRaw('LOWER(username) LIKE ?', [$q])
                    ->orWhereRaw('LOWER(email) LIKE ?', [$q]);
            });
        }

        $rol = $request->input('rol', 'all');
        if (in_array($rol, ['admin', 'suport'], true)) {
            $query->where('rol', $rol);
        }

        $perPage = (int) $request->input('per_page', 20);
        return EmpleatResource::collection($query->paginate($perPage));
    }

    public function store(StoreEmpleatRequest $request)
    {
        $data = $request->validated();
        unset($data['password_confirmation']);

        $empleat = Empleat::create($data);

        $this->logAction($request, 'create', $empleat, [
            'payload' => array_diff_key($data, ['password' => '']),
        ]);

        return (new EmpleatResource($empleat))
            ->response()
            ->setStatusCode(Response::HTTP_CREATED);
    }

    public function update(UpdateEmpleatRequest $request, $id)
    {
        $empleat = Empleat::find($id);
        if (!$empleat) {
            return response()->json([
                'message' => 'Empleado no encontrado.',
            ], Response::HTTP_NOT_FOUND);
        }

        $current = $request->user();
        if ($current && $current->id === $empleat->id && $request->has('actiu') && !$request->boolean('actiu')) {
            return response()->json([
                'message' => 'No puedes desactivarte a ti mismo.',
            ], Response::HTTP_BAD_REQUEST);
        }

        $data = $request->validated();
        unset($data['password_confirmation']);

        $empleat->update($data);

        $this->logAction($request, 'update', $empleat, [
            'payload' => array_diff_key($data, ['password' => '']),
        ]);

        return new EmpleatResource($empleat->refresh());
    }

    public function destroy(Request $request, $id)
    {
        $empleat = Empleat::find($id);
        if (!$empleat) {
            return response()->json([
                'message' => 'Empleado no encontrado.',
            ], Response::HTTP_NOT_FOUND);
        }

        if ($request->user()->id === $empleat->id) {
            return response()->json([
                'message' => 'No puedes eliminarte a ti mismo.',
            ], Response::HTTP_BAD_REQUEST);
        }

        $empleat->delete();
        $this->logAction($request, 'delete', $empleat, ['username' => $empleat->username]);

        return response()->json([
            'message' => 'Empleado eliminado correctamente.',
            'id'      => $empleat->id,
        ], Response::HTTP_OK);
    }

    protected function logAction(Request $request, string $action, Empleat $empleat, array $details = []): void
    {
        DB::table('logs')->insert([
            'user_id'    => null,
            'empleat_id' => $request->user()->id,
            'tipus'      => 'admin',
            'accio'      => "empleat_{$action}",
            'detall'     => json_encode($details),
            'entitat_afectada'    => 'empleat',
            'id_entitat_afectada' => $empleat->id,
            'ip'         => $request->ip(),
            'created_at' => now(),
        ]);
    }
}
