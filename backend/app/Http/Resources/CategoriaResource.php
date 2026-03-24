<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CategoriaResource extends JsonResource {
    public function toArray(Request $request): array {
        return [
            'id' => $this->id,
            'nom' => $this->nom,
            'icona' => $this->icona,
            'descripcio'=> $this->descripcio,
            'activa' => $this->activa
        ];
    }
}