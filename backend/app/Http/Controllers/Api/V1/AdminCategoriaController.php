<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\StoreCategoriaRequest;
use App\Http\Requests\Api\V1\UpdateCategoriaRequest;
use App\Http\Resources\CategoriaResource;
use App\Models\Categoria;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\DB;

class AdminCategoriaController extends Controller
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

        $categories = Categoria::with(['subcategories' => function ($query) {
            $query->orderBy('nom');
        }])->withCount(['objectes', 'subcategories'])
            ->orderBy('nom')
            ->get();

        return CategoriaResource::collection($categories);
    }

    public function show(Request $request, $id)
    {
        $this->authorizeAdmin($request);

        $category = Categoria::with(['subcategories' => function ($query) {
            $query->orderBy('nom');
        }])->withCount(['objectes', 'subcategories'])->find($id);

        if (!$category) {
            return response()->json([
                'message' => 'Categoria no trobada.',
            ], Response::HTTP_NOT_FOUND);
        }

        return new CategoriaResource($category);
    }

    public function store(StoreCategoriaRequest $request)
    {
        $this->authorizeAdmin($request);

        $category = Categoria::create($request->validated());
        $this->logAdminAction($request, 'create', $category, ['payload' => $request->validated()]);

        return (new CategoriaResource($category))
            ->response()
            ->setStatusCode(Response::HTTP_CREATED);
    }

    public function update(UpdateCategoriaRequest $request, $id)
    {
        $this->authorizeAdmin($request);

        $category = Categoria::find($id);
        if (!$category) {
            return response()->json([
                'message' => 'Categoria no trobada.',
            ], Response::HTTP_NOT_FOUND);
        }

        $category->update($request->validated());
        $this->logAdminAction($request, 'update', $category, ['payload' => $request->validated()]);

        return new CategoriaResource($category);
    }

    public function destroy(Request $request, $id)
    {
        $this->authorizeAdmin($request);

        $category = Categoria::find($id);
        if (!$category) {
            return response()->json([
                'message' => 'Categoria no trobada.',
            ], Response::HTTP_NOT_FOUND);
        }

        if ($category->objectes()->exists() || $category->subcategories()->exists()) {
            return response()->json([
                'message' => 'No es pot eliminar aquesta categoria mentre tingui objectes o subcategories associats.',
            ], Response::HTTP_BAD_REQUEST);
        }

        $category->delete();
        $this->logAdminAction($request, 'delete', $category);

        return response()->json([
            'message' => 'Categoria eliminada correctament.',
            'id' => $category->id,
        ], Response::HTTP_OK);
    }

    protected function logAdminAction(Request $request, string $action, Categoria $category, array $details = []): void
    {
        DB::table('logs')->insert([
            'user_id' => $request->user()->id,
            'tipus' => 'admin',
            'accio' => "categoria_{$action}",
            'detall' => json_encode($details),
            'entitat_afectada' => 'categoria',
            'id_entitat_afectada' => $category->id,
            'ip' => $request->ip(),
        ]);
    }
}
