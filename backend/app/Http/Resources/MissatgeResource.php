<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MissatgeResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        /** @var \App\Models\Missatge $this */
        $userId = $request->user()->id;

        return [
            'id'          => $this->id,
            'conversa_id' => $this->conversa_id,
            'emissor_id'  => $this->emissor_id,
            'mine'        => $this->emissor_id === $userId,
            'contingut'   => $this->contingut,
            'llegit_at'   => $this->llegit_at?->toIso8601String(),
            'created_at'  => $this->created_at?->toIso8601String(),
        ];
    }
}
