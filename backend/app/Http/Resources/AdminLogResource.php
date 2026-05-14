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

        $actor = null;
        if ($this->empleat_id) {
            $actor = [
                'tipus'    => 'empleat',
                'id'       => $this->empleat_id,
                'username' => $this->empleat_username ?? null,
                'email'    => $this->empleat_email ?? null,
                'rol'      => $this->empleat_rol ?? null,
            ];
        } elseif ($this->user_id) {
            $actor = [
                'tipus'    => 'usuari',
                'id'       => $this->user_id,
                'username' => $this->user_username ?? null,
                'email'    => $this->user_email ?? null,
                'rol'      => null,
            ];
        }

        return [
            'id'                  => $this->id,
            'actor'               => $actor,
            'tipus'               => $this->tipus,
            'accio'               => $this->accio,
            'detall'              => $details,
            'entitat_afectada'    => $this->entitat_afectada,
            'id_entitat_afectada' => $this->id_entitat_afectada,
            'ip'                  => $this->ip,
            'created_at'          => $this->created_at,
        ];
    }
}
