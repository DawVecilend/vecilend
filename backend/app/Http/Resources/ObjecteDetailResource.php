<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ObjecteDetailResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'            => $this->id,
            'nom'           => $this->nom,
            'slug'          => $this->slug,
            'descripcio'    => $this->descripcio,
            'tipus'         => $this->tipus,
            'preu_diari'    => $this->preu_diari ? (float) $this->preu_diari : null,
            'estat'         => $this->estat,

            // Coordenades via mètode del model
            'ubicacio'      => $this->coordenades(),

            // ── Propietari ──
            'propietari' => $this->whenLoaded('user', fn() => [
                'id'                => $this->user->id,
                'username'          => $this->user->username,
                'nom'               => $this->user->nom,
                'cognoms'           => $this->user->cognoms,
                'avatar_url'        => $this->user->avatar_url,
                'valoracio_mitjana' => $this->user->valoracio_mitjana ?? null,
                'valoracio_total'   => $this->user->valoracio_total ?? 0,
                'created_at'        => $this->user->created_at?->toIso8601String(),
            ]),

            // ── Categoria ──
            'categoria'     => $this->whenLoaded('categoria', fn() => [
                'id'    => $this->categoria->id,
                'nom'   => $this->categoria->nom,
                'slug'  => $this->categoria->slug,
                'icona' => $this->categoria->icona,
            ]),

            // ── Subcategoria ──
            'subcategoria' => $this->whenLoaded('subcategoria', fn() => $this->subcategoria ? [
                'id'  => $this->subcategoria->id,
                'nom' => $this->subcategoria->nom,
                'slug' => $this->subcategoria->slug,
            ] : null),

            // ── Imatges ──
            'imatges'       => $this->whenLoaded(
                'imatges',
                fn() =>
                $this->imatges->map(fn($img) => [
                    'id'    => $img->id,
                    'url'   => $img->url_cloudinary,
                    'ordre' => $img->ordre,
                ])
            ),

            // ── Valoracions ──
            'valoracions'       => $this->valoracions_data ?? [],
            'valoracio_mitjana' => $this->valoracio_mitjana ?? null,
            'total_valoracions' => $this->total_valoracions ?? 0,

            // ── Dates ocupades (transaccions actives) ──
            'dates_ocupades' => $this->dates_ocupades ?? [],

            'created_at'    => $this->created_at?->toIso8601String(),
            'updated_at'    => $this->updated_at?->toIso8601String(),
        ];
    }
}
