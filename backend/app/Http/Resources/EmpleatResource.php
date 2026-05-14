<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class EmpleatResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'         => $this->id,
            'username'   => $this->username,
            'nom'        => $this->nom,
            'cognoms'    => $this->cognoms,
            'email'      => $this->email,
            'rol'        => $this->rol,
            'actiu'      => $this->actiu,
            'created_at' => $this->created_at?->toISOString(),
        ];
    }
}
