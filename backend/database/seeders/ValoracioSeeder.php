<?php

namespace Database\Seeders;

use App\Models\Objecte;
use App\Models\User;
use Database\Seeders\Support\Catalogs;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

/**
 * Para cada objeto, genera entre 0 y 3 transacciones finalizadas + valoraciones
 * bidireccionales con comentarios curados (no Lorem Ipsum).
 *
 * Solicituds en estado finalitzat (más realista). Algunas transacciones se
 * dejan sin valoración para mostrar el caso "transacción finalizada pero sin
 * review aún".
 */
class ValoracioSeeder extends Seeder
{
    public function run(): void
    {
        $solicitants = User::all();
        $objectes    = Objecte::all();

        if ($solicitants->count() < 2 || $objectes->isEmpty()) {
            $this->command->warn('Necesitas al menos 2 usuarios y 1 objeto.');
            return;
        }

        $now = Carbon::now();
        $valoracionsCreades = 0;
        $solicitudsCreades  = 0;

        foreach ($objectes as $objecte) {
            $candidates = $solicitants->where('id', '!=', $objecte->user_id);
            if ($candidates->isEmpty()) continue;

            // Distribución: 30% sin transacciones, 50% con 1, 15% con 2, 5% con 3
            $r = mt_rand(1, 100);
            if ($r <= 30) $nTx = 0;
            elseif ($r <= 80) $nTx = 1;
            elseif ($r <= 95) $nTx = 2;
            else $nTx = 3;

            for ($i = 0; $i < $nTx; $i++) {
                $solicitant = $candidates->random();
                $diaInici = $now->copy()->subDays(mt_rand(5, 180));
                $durada   = mt_rand(2, 8);
                $diaFi    = $diaInici->copy()->addDays($durada);

                $solicitudId = DB::table('solicituds')->insertGetId([
                    'solicitant_id' => $solicitant->id,
                    'objecte_id'    => $objecte->id,
                    'data_inici'    => $diaInici->toDateString(),
                    'data_fi'       => $diaFi->toDateString(),
                    'tipus'         => $objecte->tipus,
                    'missatge'      => null,
                    'estat'         => 'finalitzat',
                    'created_at'    => $diaInici,
                    'updated_at'    => $diaFi,
                ]);
                $solicitudsCreades++;

                $transaccioId = DB::table('transaccions')->insertGetId([
                    'solicitud_id'    => $solicitudId,
                    'data_inici_real' => $diaInici,
                    'data_fi_real'    => $diaFi,
                    'estat'           => 'finalitzat',
                    'created_at'      => $diaInici,
                    'updated_at'      => $diaFi,
                ]);

                // 85% prob: solicitante valora al propietario
                if (mt_rand(1, 100) <= 85) {
                    $punts = $this->skewedScore();
                    DB::table('valoracions')->insert([
                        'transaccio_id' => $transaccioId,
                        'autor_id'      => $solicitant->id,
                        'valorat_id'    => $objecte->user_id,
                        'objecte_id'    => $objecte->id,
                        'puntuacio'     => $punts,
                        'comentari'     => Catalogs::valoracioComment($punts),
                        'created_at'    => $diaFi,
                    ]);
                    $valoracionsCreades++;
                }

                // 70% prob: propietario valora al solicitante
                if (mt_rand(1, 100) <= 70) {
                    $punts = $this->skewedScore();
                    DB::table('valoracions')->insert([
                        'transaccio_id' => $transaccioId,
                        'autor_id'      => $objecte->user_id,
                        'valorat_id'    => $solicitant->id,
                        'objecte_id'    => $objecte->id,
                        'puntuacio'     => $punts,
                        'comentari'     => Catalogs::valoracioComment($punts),
                        'created_at'    => $diaFi->copy()->addHours(mt_rand(1, 12)),
                    ]);
                    $valoracionsCreades++;
                }
            }

            // Además: 1-3 solicituds pendientes/aceptadas para variedad
            if (mt_rand(1, 100) <= 25 && $objecte->estat === 'disponible') {
                $solicitantPend = $candidates->random();
                $diaInici = $now->copy()->addDays(mt_rand(1, 30));
                $diaFi    = $diaInici->copy()->addDays(mt_rand(2, 7));
                $estat = mt_rand(0, 1) ? 'pendent' : 'acceptat';

                DB::table('solicituds')->insert([
                    'solicitant_id' => $solicitantPend->id,
                    'objecte_id'    => $objecte->id,
                    'data_inici'    => $diaInici->toDateString(),
                    'data_fi'       => $diaFi->toDateString(),
                    'tipus'         => $objecte->tipus,
                    'missatge'      => 'Hola, me interesa el objeto para esas fechas. ¿Está disponible?',
                    'estat'         => $estat,
                    'created_at'    => $now->copy()->subDays(mt_rand(0, 5)),
                    'updated_at'    => $now,
                ]);
                $solicitudsCreades++;
            }
        }

        $this->command->info("✓ {$solicitudsCreades} solicituds y {$valoracionsCreades} valoracions creadas.");
    }

    /** Distribución sesgada hacia puntuaciones altas (más realista). */
    private function skewedScore(): int
    {
        $r = mt_rand(1, 100);
        if ($r <= 60) return 5;
        if ($r <= 85) return 4;
        if ($r <= 95) return 3;
        if ($r <= 99) return 2;
        return 1;
    }
}
