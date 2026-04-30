<?php
namespace App\Http\Resources;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\DB;
use App\Http\Resources\ObjecteResource;

class UserResource extends JsonResource {
    public function toArray(Request $request): array {
        return [
            'id' => $this->id,
            'username' => $this->username,
            'nom' => $this->nom,
            'cognoms' => $this->cognoms,
            'email' => $this->email,
            'biography' => $this->biography,
            'telefon' => $this->telefon,
            'direccio' => $this->direccio,
            'avatar_url' => $this->avatar_url,
            'ubicacio' => $this->ubicacio ? $this->coordenades() : null,
            'radi_proximitat' => $this->radi_proximitat,
            'rol' => $this->rol,
            'actiu' => $this->actiu,
            'email_verified_at' => $this->email_verified_at?->toISOString(),
            'created_at' => $this->created_at?->toISOString(),
            'first_objects' => ObjecteResource::collection($this->whenLoaded('objectes')),
        ];
    }
}