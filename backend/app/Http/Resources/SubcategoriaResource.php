<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SubcategoriaResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'            => $this->id,
            'categoria_id'  => $this->categoria_id,
            'nom'           => $this->nom,
            'slug'          => $this->slug,
            'descripcio'    => $this->descripcio,
            'activa'        => $this->activa,

            'categoria' => $this->whenLoaded('categoria', fn() => [
                'id'  => $this->categoria->id,
                'nom' => $this->categoria->nom,
                'slug' => $this->categoria->slug,
            ]),

            'objectes_count' => $this->whenCounted('objectes'),
        ];
    }
}