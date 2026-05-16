<?php

namespace App\Http\Resources;

use App\Models\Pagament;
use App\Models\Valoracio;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Auth;

class TransactionResource extends JsonResource
{
    // ── Percentatges aplicats sobre el subtotal (preu_diari × dies) ──
    public const COMISSIO_PCT = 0.05;   // 5% comissió per transacció
    public const GARANTIA_PCT = 0.05;   // 5% garantia de seguretat

    public function toArray(Request $request): array
    {
        /** @var \App\Models\Solicitud $this */

        $transaccio = $this->relationLoaded('transaccio') ? $this->transaccio : null;

        $diesPrestec = (int) abs($this->data_inici->diffInDays($this->data_fi)) + 1;
        $preuDetall  = $this->calcularPreuDetall($diesPrestec);

        $paid       = $transaccio ? $this->tePagamentCompletat($transaccio) : false;
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

            // ── Detall del preu (per al frontend) ──
            'preu_subtotal'   => $preuDetall['subtotal'] ?? null,
            'preu_comissio'   => $preuDetall['comissio'] ?? null,
            'preu_garantia'   => $preuDetall['garantia'] ?? null,
            'preu_total'      => $preuDetall['total']    ?? null,

            'paid'            => $paid,
            'can_cancel'      => $canCancel,
            'can_pay'         => $canPay,
            'has_own_review'  => $this->teValoracioDelUsuari($transaccio),

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

    /**
     * Retorna el detall complet del preu: subtotal, comissió, garantia, total.
     * - `lloguer` sense preu_diari → tots null.
     * - `prestec` → tot a 0.0.
     */
    private function calcularPreuDetall(int $dies): array
    {
        if ($this->tipus !== 'lloguer') {
            return ['subtotal' => 0.0, 'comissio' => 0.0, 'garantia' => 0.0, 'total' => 0.0];
        }

        if (!$this->relationLoaded('objecte') || !$this->objecte->preu_diari) {
            return ['subtotal' => null, 'comissio' => null, 'garantia' => null, 'total' => null];
        }

        $preuDiari = (float) $this->objecte->preu_diari;
        $subtotal  = $preuDiari * $dies;
        $comissio  = $subtotal * self::COMISSIO_PCT;
        $garantia  = $subtotal * self::GARANTIA_PCT;
        $total     = $subtotal + $comissio + $garantia;

        return [
            'subtotal' => round($subtotal, 2),
            'comissio' => round($comissio, 2),
            'garantia' => round($garantia, 2),
            'total'    => round($total, 2),
        ];
    }

    private function tePagamentCompletat($transaccio): bool
    {
        if (!$transaccio || !$transaccio->relationLoaded('pagaments')) {
            return false;
        }
        return $transaccio->pagaments
            ->contains(fn($p) => $p->estat === Pagament::ESTAT_COMPLETAT);
    }

    /**
     * Indica si l'usuari autenticat ja ha emès una valoració per aquesta transacció.
     */
    private function teValoracioDelUsuari($transaccio): bool
    {
        $userId = Auth::id();
        if (!$userId || !$transaccio) {
            return false;
        }
        return Valoracio::where('transaccio_id', $transaccio->id)
            ->where('autor_id', $userId)
            ->exists();
    }

    private function canCancel($transaccio, bool $paid): bool
    {
        $userId = Auth::id();
        if (!$userId) {
            return false;
        }

        if ($this->estat === 'pendent') {
            return $userId === $this->solicitant_id;
        }

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
