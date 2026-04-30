<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Versió pública del User (per a profile/{username}, propietari d'objectes, etc).
 *
 * NO inclou: email, telefon, direccio, ubicacio (lat/lng exactes),
 *            radi_proximitat, rol, actiu, email_verified_at.
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
            'avatar_url' => $this->avatar_url,
            'created_at' => $this->created_at?->toISOString(),
        ];
    }
}
