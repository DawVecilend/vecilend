<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\CategoriaResource;
use App\Models\Categoria;
use Illuminate\Http\Request;

class CategoriaController extends Controller {
    public function index(Request $request) {
        $limit = $request->query('limit');
        
        $query = Categoria::actives()->with(['subcategories' => function ($query) {
            $query->where('activa', true)->orderBy('nom');
        }])->withCount(['objectes' => function ($query) {
            $query->where('estat', 'disponible');
        }])->orderBy('nom');
        
        if ($limit) {
            $query->limit($limit);
        }
        
        $categories = $query->get();
        
        return CategoriaResource::collection($categories);
    }
}