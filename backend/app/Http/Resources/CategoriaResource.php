<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CategoriaResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'          => $this->id,
            'nom'         => $this->nom,
            'slug'        => $this->slug,
            'icona'       => $this->icona,
            'descripcio'  => $this->descripcio,
            'activa'      => $this->activa,

            'subcategories' => $this->whenLoaded(
                'subcategories',
                fn() =>
                $this->subcategories->map(fn($sub) => [
                    'id'  => $sub->id,
                    'nom' => $sub->nom,
                    'slug' => $sub->slug,
                ])
            ),

            'objectes_count' => $this->whenCounted('objectes'),
        ];
    }
}
