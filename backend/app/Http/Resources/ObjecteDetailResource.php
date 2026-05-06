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
                'id'                         => $this->user->id,
                'username'                   => $this->user->username,
                'nom'                        => $this->user->nom,
                'cognoms'                    => $this->user->cognoms,
                'avatar_url'                 => $this->user->avatar_url,
                // Stats GENERALS de l'usuari com a propietari (mitjana ponderada per temps)
                'valoracio_propietari_avg'   => $this->user->valoracio_propietari_avg   ?? null,
                'valoracio_propietari_total' => $this->user->valoracio_propietari_total ?? 0,
                'created_at'                 => $this->user->created_at?->toIso8601String(),
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
                'id'   => $this->subcategoria->id,
                'nom'  => $this->subcategoria->nom,
                'slug' => $this->subcategoria->slug,
            ] : null),

            // ── Imatges ──
            'imatges'       => $this->whenLoaded(
                'imatges',
                fn() => $this->imatges->map(fn($img) => [
                    'id'    => $img->id,
                    'url'   => $img->url_cloudinary,
                    'ordre' => $img->ordre,
                ])
            ),

            // ── Stats del propietari ESPECÍFIQUES per a aquest objecte ──
            'valoracio_objecte' => [
                'avg'   => $this->valoracions_objecte_avg   ?? null,
                'total' => $this->valoracions_objecte_total ?? 0,
            ],

            // ── Llista de comentaris de les valoracions d'aquest objecte ──
            'valoracions'    => $this->valoracions_data ?? [],

            // ── Dates ocupades (transaccions actives) ──
            'dates_ocupades' => $this->dates_ocupades ?? [],

            'created_at'     => $this->created_at?->toIso8601String(),
            'updated_at'     => $this->updated_at?->toIso8601String(),
        ];
    }
}
