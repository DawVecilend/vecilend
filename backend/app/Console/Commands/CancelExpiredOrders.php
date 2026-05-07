<?php

namespace App\Console\Commands;

use App\Models\Notificacio;
use App\Models\Pagament;
use App\Models\Solicitud;
use Illuminate\Console\Command;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

class CancelExpiredOrders extends Command
{
    protected $signature = 'vecilend:cancel-expired
                            {--days-overdue-payment=7 : Dies de cortesia abans de cancel·lar lloguers impagats}';

    protected $description = 'Cancel·la solicituds pendents vençudes i transaccions de lloguer impagades fora de termini.';

    public function handle(): int
    {
        $today = Carbon::today();
        $diesOverduePagament = (int) $this->option('days-overdue-payment');

        // ── 1. Solicituds 'pendent' amb data_inici en el passat ────────────────
        $expiredRequests = Solicitud::with('objecte')
            ->where('estat', 'pendent')
            ->where('data_inici', '<', $today)
            ->get();

        foreach ($expiredRequests as $sol) {
            DB::transaction(function () use ($sol) {
                $sol->update(['estat' => 'cancellat']);
                Notificacio::create([
                    'user_id'                 => $sol->solicitant_id,
                    'tipus'                   => Notificacio::TIPUS_SOLICITUD_CANCELLADA,
                    'titol'                   => 'Solicitud caducada',
                    'missatge'                => "Tu solicitud para «{$sol->objecte->nom}» ha caducado y se ha cancelado automáticamente.",
                    'entitat_referenciada'    => 'solicitud',
                    'id_entitat_referenciada' => $sol->id,
                ]);
            });
        }
        $this->info("Solicituds vençudes cancel·lades: " . $expiredRequests->count());

        // ── 2. Transaccions de lloguer impagades amb data_fi passada ───────────
        $overdueUnpaid = Solicitud::with(['objecte', 'transaccio.pagaments'])
            ->where('estat', 'acceptat')
            ->where('tipus', 'lloguer')
            ->where('data_fi', '<', $today->copy()->subDays($diesOverduePagament))
            ->whereHas('transaccio', fn($q) => $q->where('estat', 'en_curs'))
            ->whereDoesntHave('transaccio.pagaments', fn($q) => $q->where('estat', Pagament::ESTAT_COMPLETAT))
            ->get();

        foreach ($overdueUnpaid as $sol) {
            DB::transaction(function () use ($sol) {
                $sol->transaccio->update(['estat' => 'cancellat', 'data_fi_real' => now()]);
                $sol->objecte()->update(['estat' => 'disponible']);

                foreach ([$sol->solicitant_id, $sol->objecte->user_id] as $uid) {
                    Notificacio::create([
                        'user_id'                 => $uid,
                        'tipus'                   => Notificacio::TIPUS_TRANSACCIO_CANCELLADA,
                        'titol'                   => 'Transacción cancelada',
                        'missatge'                => "La transacción de «{$sol->objecte->nom}» ha sido cancelada por falta de pago.",
                        'entitat_referenciada'    => 'solicitud',
                        'id_entitat_referenciada' => $sol->id,
                    ]);
                }
            });
        }
        $this->info("Transaccions impagades cancel·lades: " . $overdueUnpaid->count());

        // ── 3. Recordatori al owner per a transaccions sense tancar fora ───────
        //     de termini (només si encara no s'havia enviat).
        $remindersSent = 0;
        $needReminder = Solicitud::with(['objecte', 'transaccio'])
            ->where('estat', 'acceptat')
            ->where('data_fi', '<', $today)
            ->whereHas('transaccio', fn($q) => $q->where('estat', 'en_curs'))
            ->get();

        foreach ($needReminder as $sol) {
            $alreadySent = Notificacio::where('user_id', $sol->objecte->user_id)
                ->where('tipus', Notificacio::TIPUS_TRANSACCIO_RECORDATORI_DEVOLUCIO)
                ->where('entitat_referenciada', 'solicitud')
                ->where('id_entitat_referenciada', $sol->id)
                ->exists();

            if ($alreadySent) {
                continue;
            }

            Notificacio::create([
                'user_id'                 => $sol->objecte->user_id,
                'tipus'                   => Notificacio::TIPUS_TRANSACCIO_RECORDATORI_DEVOLUCIO,
                'titol'                   => 'Confirmar recepción pendiente',
                'missatge'                => "La fecha de devolución de «{$sol->objecte->nom}» ya ha pasado. Recuerda confirmar la recepción del objeto cuando lo recuperes.",
                'entitat_referenciada'    => 'solicitud',
                'id_entitat_referenciada' => $sol->id,
            ]);
            $remindersSent++;
        }
        $this->info("Recordatoris enviats al owner: {$remindersSent}");

        return self::SUCCESS;
    }
}
