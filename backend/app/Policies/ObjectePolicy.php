<?php

namespace App\Policies;

use App\Models\Objecte;
use App\Models\User;

class ObjectePolicy
{
    /**
     * Només el propietari pot actualitzar l'objecte.
     */
    public function update(User $user, Objecte $objecte): bool
    {
        return $user->id === $objecte->user_id;
    }

    /**
     * Només el propietari pot eliminar l'objecte.
     */
    public function delete(User $user, Objecte $objecte): bool
    {
        return $user->id === $objecte->user_id;
    }

    /**
     * L'administrador no pot publicar objectes: el seu rol és
     * supervisar la plataforma, no participar com a usuari corrent.
     */
    public function create(\App\Models\User $user): bool
    {
        return $user->rol !== 'admin';
    }
}
