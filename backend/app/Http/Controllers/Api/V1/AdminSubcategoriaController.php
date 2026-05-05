<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\StoreSubcategoriaRequest;
use App\Http\Requests\Api\V1\UpdateSubcategoriaRequest;
use App\Http\Resources\SubcategoriaResource;
use App\Models\Objecte;
use App\Models\Subcategoria;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\DB;

class AdminSubcategoriaController extends Controller
{
    private function authorizeAdmin(Request $request): void
    {
        if (!$request->user() || $request->user()->rol !== 'admin') {
            abort(Response::HTTP_FORBIDDEN, 'Accés denegat.');
        }
    }

    public function index(Request $request)
    {
        $this->authorizeAdmin($request);

        $subcategories = Subcategoria::with('categoria')
            ->withCount('objectes')
            ->orderBy('nom')
            ->get();

        return SubcategoriaResource::collection($subcategories);
    }

    public function show(Request $request, $id)
    {
        $this->authorizeAdmin($request);

        $subcategory = Subcategoria::with('categoria')
            ->withCount('objectes')
            ->find($id);

        if (!$subcategory) {
            return response()->json([
                'message' => 'Subcategoria no trobada.',
            ], Response::HTTP_NOT_FOUND);
        }

        return new SubcategoriaResource($subcategory);
    }

    public function store(StoreSubcategoriaRequest $request)
    {
        $this->authorizeAdmin($request);

        $subcategory = Subcategoria::create($request->validated());
        $this->logAdminAction($request, 'create', $subcategory, ['payload' => $request->validated()]);

        return (new SubcategoriaResource($subcategory))
            ->response()
            ->setStatusCode(Response::HTTP_CREATED);
    }

    public function update(UpdateSubcategoriaRequest $request, $id)
    {
        $this->authorizeAdmin($request);

        $subcategory = Subcategoria::find($id);
        if (!$subcategory) {
            return response()->json([
                'message' => 'Subcategoria no trobada.',
            ], Response::HTTP_NOT_FOUND);
        }

        $data = $request->validated();
        $categoriaChanged = array_key_exists('categoria_id', $data)
            && $data['categoria_id'] !== $subcategory->categoria_id;

        DB::transaction(function () use ($subcategory, $data, $categoriaChanged) {
            $subcategory->update($data);

            if ($categoriaChanged) {
                Objecte::where('subcategoria_id', $subcategory->id)
                    ->update(['categoria_id' => $data['categoria_id']]);
            }
        });

        $this->logAdminAction($request, 'update', $subcategory, ['payload' => $data]);

        return new SubcategoriaResource($subcategory->refresh());
    }

    public function destroy(Request $request, $id)
    {
        $this->authorizeAdmin($request);

        $subcategory = Subcategoria::find($id);
        if (!$subcategory) {
            return response()->json([
                'message' => 'Subcategoria no trobada.',
            ], Response::HTTP_NOT_FOUND);
        }

        if ($subcategory->objectes()->exists()) {
            return response()->json([
                'message' => 'No es pot eliminar aquesta subcategoria mentre tingui objectes associats.',
            ], Response::HTTP_BAD_REQUEST);
        }

        $subcategory->delete();
        $this->logAdminAction($request, 'delete', $subcategory);

        return response()->json([
            'message' => 'Subcategoria eliminada correctament.',
            'id' => $subcategory->id,
        ], Response::HTTP_OK);
    }

    protected function logAdminAction(Request $request, string $action, Subcategoria $subcategory, array $details = []): void
    {
        DB::table('logs')->insert([
            'user_id' => $request->user()->id,
            'tipus' => 'admin',
            'accio' => "subcategoria_{$action}",
            'detall' => json_encode($details),
            'entitat_afectada' => 'subcategoria',
            'id_entitat_afectada' => $subcategory->id,
            'ip' => $request->ip(),
        ]);
    }
}