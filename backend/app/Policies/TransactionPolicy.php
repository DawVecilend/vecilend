<?php

namespace App\Policies;

use App\Models\Solicitud;
use App\Models\User;

class TransactionPolicy
{
    /**
     * Només el propietari de l'objecte pot acceptar la sol·licitud.
     */
    public function accept(User $user, Solicitud $solicitud): bool
    {
        return $user->id === $solicitud->objecte->user_id;
    }

    /**
     * Només el propietari de l'objecte pot rebutjar la sol·licitud.
     */
    public function reject(User $user, Solicitud $solicitud): bool
    {
        return $user->id === $solicitud->objecte->user_id;
    }

    /**
     * Només el propietari de l'objecte pot registrar la devolució
     * (confirma que ha rebut l'objecte de tornada).
     */
    public function returnObject(User $user, Solicitud $solicitud): bool
    {
        return $user->id === $solicitud->objecte->user_id;
    }
}
