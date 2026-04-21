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
}
