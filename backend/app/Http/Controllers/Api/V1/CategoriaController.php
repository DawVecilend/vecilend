<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\CategoriaResource;
use App\Models\Categoria;

class CategoriaController extends Controller {
    public function index() {
        $categories = Categoria::actives()->with(['subcategories' => function ($query) {
            $query->where('activa', true)->orderBy('nom');
        }])->withCount(['objectes' => function ($query) {
            $query->where('estat', 'disponible');
        }])->orderBy('nom')->get();
        
        return CategoriaResource::collection($categories);
    }
}