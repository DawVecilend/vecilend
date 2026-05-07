<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ConversaResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        /** @var \App\Models\Conversa $this */
        $userId = $request->user()->id;
        $altre  = $this->altreUsuari($userId);

        // Si el controller ha fet withCount('missatges as missatges_no_llegits_count')
        // l'usem; si no, fallback amb una query lazy.
        $noLlegits = $this->missatges_no_llegits_count
            ?? $this->missatgesNoLlegitsPer($userId);

        $ultim = $this->relationLoaded('ultimMissatge') ? $this->ultimMissatge : null;

        return [
            'id'                  => $this->id,
            'altre_usuari'        => $altre ? [
                'id'         => $altre->id,
                'username'   => $altre->username,
                'nom'        => $altre->nom,
                'cognoms'    => $altre->cognoms,
                'avatar_url' => $altre->avatar_url,
            ] : null,
            'objecte'             => $this->whenLoaded('objecte', fn() => $this->objecte ? [
                'id'   => $this->objecte->id,
                'nom'  => $this->objecte->nom,
                'slug' => $this->objecte->slug,
            ] : null),
            'ultim_missatge'      => $ultim ? [
                'id'         => $ultim->id,
                'contingut'  => $ultim->contingut,
                'emissor_id' => $ultim->emissor_id,
                'mine'       => $ultim->emissor_id === $userId,
                'created_at' => $ultim->created_at?->toIso8601String(),
            ] : null,
            'missatges_no_llegits' => (int) $noLlegits,
            'created_at'          => $this->created_at?->toIso8601String(),
            'updated_at'          => $this->updated_at?->toIso8601String(),
        ];
    }
}
