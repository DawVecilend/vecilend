<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ReportResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'           => $this->id,
            'motiu'        => $this->motiu,
            'descripcio'   => $this->descripcio,
            'estat'        => $this->estat,
            'resolucio_nota' => $this->resolucio_nota,
            'created_at'   => $this->created_at?->toISOString(),
            'resolt_at'    => $this->resolt_at?->toISOString(),

            'reportador' => $this->whenLoaded('reportador', function () {
                return $this->reportador ? [
                    'id'       => $this->reportador->id,
                    'username' => $this->reportador->username,
                    'nom'      => $this->reportador->nom,
                    'email'    => $this->reportador->email,
                ] : null;
            }),

            'usuari_reportat' => $this->whenLoaded('usuariReportat', function () {
                return $this->usuariReportat ? [
                    'id'       => $this->usuariReportat->id,
                    'username' => $this->usuariReportat->username,
                    'nom'      => $this->usuariReportat->nom,
                    'cognoms'  => $this->usuariReportat->cognoms,
                    'email'    => $this->usuariReportat->email,
                    'actiu'    => $this->usuariReportat->actiu,
                ] : null;
            }),

            'objecte' => $this->whenLoaded('objecte', function () {
                return $this->objecte ? [
                    'id'  => $this->objecte->id,
                    'nom' => $this->objecte->nom,
                ] : null;
            }),

            'revisor' => $this->whenLoaded('revisor', function () {
                return $this->revisor ? [
                    'id'       => $this->revisor->id,
                    'username' => $this->revisor->username,
                    'nom'      => $this->revisor->nom,
                    'rol'      => $this->revisor->rol,
                ] : null;
            }),
        ];
    }
}
