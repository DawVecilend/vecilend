<?php

namespace App\Http\Resources;

use App\Models\Pagament;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Auth;

class TransactionResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        /** @var \App\Models\Solicitud $this */

        $transaccio = $this->relationLoaded('transaccio') ? $this->transaccio : null;

        $diesPrestec = (int) abs($this->data_inici->diffInDays($this->data_fi)) + 1;
        $preuTotal   = $this->calcularPreuTotal($diesPrestec);

        $paid       = $transaccio ? $this->teePagamentCompletat($transaccio) : false;
        $canCancel  = $this->canCancel($transaccio, $paid);
        $canPay     = $this->canPay($transaccio, $paid);

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

            'paid'            => $paid,
            'can_cancel'      => $canCancel,
            'can_pay'         => $canPay,

            'objecte'         => $this->whenLoaded('objecte', function () {
                $imatges = $this->objecte->relationLoaded('imatges')
                    ? $this->objecte->imatges->map(fn($img) => [
                        'id'    => $img->id,
                        'url'   => $img->url_cloudinary,
                        'ordre' => $img->ordre,
                    ])
                    : [];

                return [
                    'id'         => $this->objecte->id,
                    'nom'        => $this->objecte->nom,
                    'slug'       => $this->objecte->slug,
                    'tipus'      => $this->objecte->tipus,
                    'preu_diari' => $this->objecte->preu_diari ? (float) $this->objecte->preu_diari : null,
                    'estat'      => $this->objecte->estat,
                    'imatges'    => $imatges,
                ];
            }),

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

    private function teePagamentCompletat($transaccio): bool
    {
        if (!$transaccio || !$transaccio->relationLoaded('pagaments')) {
            return false;
        }
        return $transaccio->pagaments
            ->contains(fn($p) => $p->estat === Pagament::ESTAT_COMPLETAT);
    }

    private function canCancel($transaccio, bool $paid): bool
    {
        $userId = Auth::id();
        if (!$userId) {
            return false;
        }

        // Solicitud pendent → solicitant pot cancel·lar
        if ($this->estat === 'pendent') {
            return $userId === $this->solicitant_id;
        }

        // Transacció en curs sense pagament i abans de data_inici → ambdues parts
        if ($transaccio && $transaccio->estat === 'en_curs' && !$paid) {
            $ownerId = $this->relationLoaded('objecte') ? $this->objecte->user_id : null;
            $esPart  = $userId === $this->solicitant_id || $userId === $ownerId;
            if ($esPart && Carbon::today()->lt($this->data_inici)) {
                return true;
            }
        }

        return false;
    }

    private function canPay($transaccio, bool $paid): bool
    {
        if ($this->tipus !== 'lloguer' || $paid) {
            return false;
        }
        if (!$transaccio || $transaccio->estat !== 'en_curs') {
            return false;
        }
        return Auth::id() === $this->solicitant_id;
    }
}
