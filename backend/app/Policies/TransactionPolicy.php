<?php

namespace App\Policies;

use App\Models\Pagament;
use App\Models\Solicitud;
use App\Models\User;
use Illuminate\Support\Carbon;

class TransactionPolicy
{
    public function accept(User $user, Solicitud $solicitud): bool
    {
        return $user->id === $solicitud->objecte->user_id;
    }

    public function reject(User $user, Solicitud $solicitud): bool
    {
        return $user->id === $solicitud->objecte->user_id;
    }

    public function returnObject(User $user, Solicitud $solicitud): bool
    {
        return $user->id === $solicitud->objecte->user_id;
    }

    /**
     * Cancel·lació d'una solicitud pendent.
     * Només el solicitant la pot cancel·lar (l'owner ja té 'Rebutjar').
     */
    public function cancelRequest(User $user, Solicitud $solicitud): bool
    {
        if ($solicitud->estat !== 'pendent') {
            return false;
        }

        return $user->id === $solicitud->solicitant_id;
    }

    /**
     * Cancel·lació d'una transacció.
     * Permès per a propietari i solicitant si:
     *   - la transacció està 'en_curs'
     *   - NO hi ha cap pagament 'completat'
     *   - encara no ha arribat la data d'inici pactada
     */
    public function cancelTransaction(User $user, Solicitud $solicitud): bool
    {
        $transaccio = $solicitud->transaccio;
        if (!$transaccio || $transaccio->estat !== 'en_curs') {
            return false;
        }

        $esPart = $user->id === $solicitud->solicitant_id
            || $user->id === $solicitud->objecte->user_id;
        if (!$esPart) {
            return false;
        }

        $teePagament = $transaccio->pagaments()
            ->where('estat', Pagament::ESTAT_COMPLETAT)
            ->exists();
        if ($teePagament) {
            return false;
        }

        return Carbon::today()->lt($solicitud->data_inici);
    }

    /**
     * Permís de pagament: només el solicitant, transacció en curs, lloguer
     * sense pagament previ completat.
     */
    public function pay(User $user, Solicitud $solicitud): bool
    {
        if ($solicitud->tipus !== 'lloguer') {
            return false;
        }
        if ($solicitud->estat !== 'acceptat') {
            return false;
        }
        $transaccio = $solicitud->transaccio;
        if (!$transaccio || $transaccio->estat !== 'en_curs') {
            return false;
        }
        if ($user->id !== $solicitud->solicitant_id) {
            return false;
        }

        return !$transaccio->pagaments()
            ->where('estat', Pagament::ESTAT_COMPLETAT)
            ->exists();
    }
}
