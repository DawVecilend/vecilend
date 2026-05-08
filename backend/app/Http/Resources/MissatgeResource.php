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

            // ── Objecte associat (per mostrar tarjeta "Sobre el objeto") ──
            'objecte'     => $this->whenLoaded('objecte', fn() => $this->objecte ? [
                'id'              => $this->objecte->id,
                'nom'              => $this->objecte->nom,
                'slug'             => $this->objecte->slug,
                'preu_diari'       => $this->objecte->preu_diari ? (float) $this->objecte->preu_diari : null,
                'tipus'            => $this->objecte->tipus,
                'imatge_principal' => $this->objecte->relationLoaded('imatges')
                    ? optional($this->objecte->imatges->first())->url_cloudinary
                    : null,
            ] : null),

            // ── Sol·licitud associada (per mostrar "Solicitud del objeto" amb dies i preu) ──
            'solicitud' => $this->whenLoaded('solicitud', fn() => $this->solicitud ? [
                'id'         => $this->solicitud->id,
                'data_inici' => $this->solicitud->data_inici,
                'data_fi'    => $this->solicitud->data_fi,
            ] : null),

            // ── Missatge citat (per al "Responder") ──
            'respon_a' => $this->whenLoaded('responA', fn() => $this->responA ? [
                'id'        => $this->responA->id,
                'contingut' => mb_substr($this->responA->contingut, 0, 200),
                'mine'      => $this->responA->emissor_id === $userId,
                'autor'     => $this->responA->emissor_id === $userId
                    ? 'Tú'
                    : ($this->responA->relationLoaded('emissor') && $this->responA->emissor
                        ? $this->responA->emissor->nom
                        : 'Otra persona'),
            ] : null),
        ];
    }
}
