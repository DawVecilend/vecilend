<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\ObjecteResource;
use App\Models\Objecte;
use Illuminate\Http\Request;
use App\Services\CloudinaryService;
use App\Models\ImatgeObjecte;

class ObjecteController extends Controller {
    public function index(Request $request) {
        $request->validate([
            'search'   => 'nullable|string|max:100',
            'category' => 'nullable|integer|exists:categories,id',
            'sort'     => 'nullable|string|in:recent,price_asc,price_desc,rating',
            'page'     => 'nullable|integer|min:1',
            'per_page' => 'nullable|integer|min:1|max:50',
            'lat'      => 'nullable|numeric|between:-90,90',
            'lng'      => 'nullable|numeric|between:-180,180',
            'radius'   => 'nullable|integer|min:500|max:50000',
        ]);

        $query = Objecte::query()->disponible()->with(['user:id,nom,avatar_url', 'categoria:id,nom,icona', 'imatges']);

        if ($request->filled('search')) {
            $query->cerca($request->input('search'));
        }
        
        if ($request->filled('category')) {
            $query->perCategoria((int) $request->input('category'));
        }
        
        if ($request->filled('lat') && $request->filled('lng')) {
            $radius = (int) $request->input('radius', 5000); 
            $query->aProximitat(
                (float) $request->input('lat'),
                (float) $request->input('lng'),
                $radius
            );
        }
        
        $sort = $request->input('sort', 'recent');
        switch ($sort) {
            case 'price_asc':
                $query->orderBy('preu_diari', 'asc');
                break;

            case 'price_desc':
                $query->orderBy('preu_diari', 'desc');
                break;

            case 'rating':
                
                $query->orderByDesc('created_at');
                break;

            case 'recent':
            default:
                $query->orderByDesc('created_at');
                break;
        }

        $perPage = (int) $request->input('per_page', 20);
        $objectes = $query->paginate($perPage);

        return ObjecteResource::collection($objectes);
    }
    
    private function processarImatges(array $files, int $objecteId, CloudinaryService $cloudinary): void {
        foreach ($files as $index => $file) {
            $result = $cloudinary->uploadObjecteImage($file, $objecteId);
            ImatgeObjecte::create([
                'objecte_id' => $objecteId,
                'url_cloudinary' => $result['url'],
                'public_id_cloudinary' => $result['public_id'],
                'ordre' => $index,
            ]);
        }
    }
    
    private function eliminarImatges(int $objecteId, CloudinaryService $cloudinary): void {
        $imatges = ImatgeObjecte::where('objecte_id', $objecteId)->get();
        $publicIds = $imatges->pluck('public_id_cloudinary')->toArray();
        $cloudinary->deleteMultiple($publicIds);
        ImatgeObjecte::where('objecte_id', $objecteId)->delete();
    }
}
