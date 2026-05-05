<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ObjecteResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'nom' => $this->nom,
            'slug' => $this->slug,
            'descripcio' => $this->descripcio,
            'tipus' => $this->tipus,
            'preu_diari' => $this->preu_diari ? (float) $this->preu_diari : null,
            'estat' => $this->estat,
            'ubicacio' => ($this->lat !== null && $this->lng !== null)
                ? ['lat' => (float) $this->lat, 'lng' => (float) $this->lng]
                : ($this->ubicacio ? $this->coordenades() : null),

            'distancia_metres' => isset($this->distancia_metres)
                ? (int) round((float) $this->distancia_metres)
                : null,

            'imatge_principal' => $this->whenLoaded('imatges', function () {
                $primera = $this->imatges->first();
                return $primera?->url_cloudinary;
            }),

            'user' => new \App\Http\Resources\PublicUserResource($this->whenLoaded('user')),
            'categoria' => $this->whenLoaded('categoria', function () {
                return [
                    'id' => $this->categoria->id,
                    'nom' => $this->categoria->nom,
                    'slug' => $this->categoria->slug,
                    'icona' => $this->categoria->icona
                ];
            }),

            'subcategoria' => $this->whenLoaded('subcategoria', function () {
                return $this->subcategoria ? [
                    'id'  => $this->subcategoria->id,
                    'nom' => $this->subcategoria->nom,
                    'slug' => $this->subcategoria->slug,
                ] : null;
            }),

            'imatges' => $this->whenLoaded('imatges', function () {
                return $this->imatges->map(fn($img) => [
                    'id' => $img->id,
                    'url' => $img->url_cloudinary,
                    'ordre' => $img->ordre,
                ]);
            }),

            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String()
        ];
    }
}
