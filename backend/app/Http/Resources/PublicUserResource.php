<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Versió pública del User (per a profile/{username}, propietari d'objectes, etc).
 *
 * NO inclou: email, telefon, ubicacio (lat/lng exactes),
 *            rol, actiu, email_verified_at.
 *
 * Aquests camps només es retornen via /me (UserResource complet).
 */
class PublicUserResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'         => $this->id,
            'username'   => $this->username,
            'nom'        => $this->nom,
            'cognoms'    => $this->cognoms,
            'biography'  => $this->biography,
            'direccio'   => $this->direccio,
            'avatar_url' => $this->avatar_url,

            // Stats noves (mitjana ponderada per temps)
            'valoracio_propietari_avg'   => $this->valoracio_propietari_avg   ?? null,
            'valoracio_propietari_total' => $this->valoracio_propietari_total ?? 0,
            'valoracio_solicitant_avg'   => $this->valoracio_solicitant_avg   ?? null,
            'valoracio_solicitant_total' => $this->valoracio_solicitant_total ?? 0,
            'total_transaccions'         => $this->total_transaccions         ?? 0,

            'created_at' => $this->created_at?->toISOString(),
        ];
    }
}
