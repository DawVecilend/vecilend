<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Carbon;

class TransactionResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        /** @var \App\Models\Solicitud $this */

        // Assumim que el controller sempre carrega ->load('transaccio') abans
        // de retornar el Resource. Si no està carregada, retornem null sense
        // disparar query lazy.
        $transaccio = $this->relationLoaded('transaccio') ? $this->transaccio : null;

        $diesPrestec = (int) abs($this->data_inici->diffInDays($this->data_fi)) + 1;
        $preuTotal   = $this->calcularPreuTotal($diesPrestec);

        return [
            'id'              => $this->id,
            'objecte_id'      => $this->objecte_id,
            'requester_id'    => $this->solicitant_id,
            'owner_id'        => $this->whenLoaded('objecte', fn() => $this->objecte->user_id),

            'data_inici'      => $this->data_inici?->toDateString(),
            'data_fi'         => $this->data_fi?->toDateString(),
            'dies'            => $diesPrestec,

            'tipus'           => $this->tipus,
            'estat'           => $this->estat,

            'missatge'        => $this->missatge,
            'preu_total'      => $preuTotal,

            'objecte'         => $this->whenLoaded('objecte', fn() => [
                'id'         => $this->objecte->id,
                'nom'        => $this->objecte->nom,
                'slug'       => $this->objecte->slug,
                'tipus'      => $this->objecte->tipus,
                'preu_diari' => $this->objecte->preu_diari ? (float) $this->objecte->preu_diari : null,
                'estat'      => $this->objecte->estat,
            ]),

            'requester'       => $this->whenLoaded('solicitant', fn() => [
                'id'         => $this->solicitant->id,
                'username'   => $this->solicitant->username,
                'nom'        => $this->solicitant->nom,
                'cognoms'    => $this->solicitant->cognoms,
                'avatar_url' => $this->solicitant->avatar_url,
            ]),

            'owner'           => $this->whenLoaded('objecte', function () {
                $owner = $this->objecte->relationLoaded('user') ? $this->objecte->user : null;

                return $owner ? [
                    'id'         => $owner->id,
                    'username'   => $owner->username,
                    'nom'        => $owner->nom,
                    'cognoms'    => $owner->cognoms,
                    'avatar_url' => $owner->avatar_url,
                ] : null;
            }),

            'transaccio'      => $transaccio ? [
                'id'              => $transaccio->id,
                'data_inici_real' => $transaccio->data_inici_real?->toIso8601String(),
                'data_fi_real'    => $transaccio->data_fi_real?->toIso8601String(),
                'estat'           => $transaccio->estat,
            ] : null,

            'created_at'      => $this->created_at?->toIso8601String(),
            'updated_at'      => $this->updated_at?->toIso8601String(),
        ];
    }

    /**
     * Calcula el preu total del lloguer. Per a préstecs retorna 0.
     */
    private function calcularPreuTotal(int $dies): ?float
    {
        if ($this->tipus !== 'lloguer') {
            return 0.0;
        }

        if (!$this->relationLoaded('objecte') || !$this->objecte->preu_diari) {
            return null;
        }

        return round($dies * (float) $this->objecte->preu_diari, 2);
    }
}
