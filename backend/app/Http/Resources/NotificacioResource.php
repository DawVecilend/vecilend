<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class NotificacioResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'                       => $this->id,
            'tipus'                    => $this->tipus,
            'titol'                    => $this->titol,
            'missatge'                 => $this->missatge,
            'entitat_referenciada'     => $this->entitat_referenciada,
            'id_entitat_referenciada'  => $this->id_entitat_referenciada,
            'llegida'                  => (bool) $this->llegida,
            'created_at'               => $this->created_at?->toIso8601String(),
        ];
    }
}
