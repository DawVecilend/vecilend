<?php

namespace Database\Seeders;

use App\Models\Objecte;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Carbon;

/**
 * Genera transaccions finalitzades + valoracions BIDIRECCIONALS perquè els usuaris
 * tinguin mitjanes realistes als dos rols (propietari i sol·licitant).
 */
class ValoracioSeeder extends Seeder
{
    public function run(): void
    {
        $solicitants = User::where('rol', '!=', 'admin')->get();
        $objectes    = Objecte::all();

        if ($solicitants->count() < 2 || $objectes->isEmpty()) {
            $this->command->warn('Necessites com a mínim 2 usuaris i 1 objecte.');
            return;
        }

        $now = Carbon::now();
        $valoracionsCreades = 0;

        foreach ($objectes as $objecte) {
            $solicitantsPossibles = $solicitants->where('id', '!=', $objecte->user_id);
            if ($solicitantsPossibles->isEmpty()) continue;

            $nValoracions = rand(1, 4);

            for ($i = 0; $i < $nValoracions; $i++) {
                $solicitant = $solicitantsPossibles->random();

                // Distribuïm dates en finestres de 5-180 dies enrere per crear evolució temporal
                $diaInici = $now->copy()->subDays(rand(5, 180));
                $durada   = rand(3, 7);
                $diaFi    = $diaInici->copy()->addDays($durada);

                // Solicitud
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

                // Transacció
                $transaccioId = DB::table('transaccions')->insertGetId([
                    'solicitud_id'    => $solicitudId,
                    'data_inici_real' => $diaInici,
                    'data_fi_real'    => $diaFi,
                    'estat'           => 'finalitzat',
                    'created_at'      => $diaInici,
                    'updated_at'      => $diaFi,
                ]);

                // 1) El sol·licitant valora el PROPIETARI
                DB::table('valoracions')->insert([
                    'transaccio_id' => $transaccioId,
                    'autor_id'      => $solicitant->id,
                    'valorat_id'    => $objecte->user_id,
                    'objecte_id'    => $objecte->id,
                    'puntuacio'     => rand(3, 5),
                    'comentari'     => fake('ca_ES')->sentence(),
                    'created_at'    => $diaFi,
                ]);
                $valoracionsCreades++;

                // 2) Amb 70% de probabilitat, el PROPIETARI també valora el sol·licitant
                if (rand(1, 100) <= 70) {
                    DB::table('valoracions')->insert([
                        'transaccio_id' => $transaccioId,
                        'autor_id'      => $objecte->user_id,
                        'valorat_id'    => $solicitant->id,
                        'objecte_id'    => $objecte->id,
                        'puntuacio'     => rand(3, 5),
                        'comentari'     => fake('ca_ES')->sentence(),
                        'created_at'    => $diaFi->copy()->addHours(rand(1, 12)),
                    ]);
                    $valoracionsCreades++;
                }
            }
        }

        $this->command->info("✓ {$valoracionsCreades} valoracions sintètiques creades.");
    }
}
