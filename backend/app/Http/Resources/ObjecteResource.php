<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ObjecteResource extends JsonResource {
    public function toArray(Request $request): array {
        return [
            'id' => $this->id,
            'nom' => $this->nom,
            'slug' => $this->slug,
            'descripcio' => $this->descripcio,
            'tipus' => $this->tipus,
            'preu_diari' => $this->preu_diari ? (float) $this->preu_diari : null,
            'estat' => $this->estat,
            'ubicacio' => $this->whenNotNull(
                $this->ubicacio ? $this->coordenades() : null
            ),

            'imatge_principal' => $this->whenLoaded('imatges', function () {
                $primera = $this->imatges->first();
                return $primera?->url_cloudinary;
            }),

            'user' => new UserResource($this->whenLoaded('user')),
            'categoria' => $this->whenLoaded('categoria', function () {
                return [
                    'id' => $this->categoria->id,
                    'nom' => $this->categoria->nom,
                    'icona' => $this->categoria->icona
                ];
            }),

            'subcategories' => $this->whenLoaded('subcategories', function () {
                return $this->subcategories->map(fn($sub) => [
                    'id' => $sub->id,
                    'nom' => $sub->nom
                ]);
            }),

            'imatges' => $this->whenLoaded('imatges', function () {
                return $this->imatges->map(fn($img) => [
                    'id' => $img->id,
                    'original' => $img->url_cloudinary,
                    'thumbnail' => $img->thumbnail_url,
                    'medium' => $img->medium_url,
                    'large' => $img->large_url,
                    'ordre' => $img->ordre,
                ]);
            }),

            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String()
        ];
    }
}
