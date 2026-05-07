<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AdminLogResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $details = $this->detall;
        if (is_string($details)) {
            $decoded = json_decode($details, true);
            if (json_last_error() === JSON_ERROR_NONE) {
                $details = $decoded;
            }
        }

        return [
            'id' => $this->id,
            'user_id' => $this->user_id,
            'user' => $this->user_id ? [
                'username' => $this->user_username,
                'email' => $this->user_email,
            ] : null,
            'tipus' => $this->tipus,
            'accio' => $this->accio,
            'detall' => $details,
            'entitat_afectada' => $this->entitat_afectada,
            'id_entitat_afectada' => $this->id_entitat_afectada,
            'ip' => $this->ip,
            'created_at' => $this->created_at,
        ];
    }
}
