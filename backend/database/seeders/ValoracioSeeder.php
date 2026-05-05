<?php

namespace Database\Seeders;

use App\Models\Objecte;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Carbon;

/**
 * Genera transaccions finalitzades + valoracions perquè els usuaris
 * tinguin una mitjana de valoració realista a la UI.
 */
class ValoracioSeeder extends Seeder
{
    public function run(): void
    {
        $solicitants = User::where('rol', '!=', 'admin')->get();
        $objectes    = Objecte::all();

        if ($solicitants->count() < 2 || $objectes->isEmpty()) {
            $this->command->warn('Necessites com a mínim 2 usuaris i 1 objecte. Executa UserSeeder i ObjecteSeeder primer.');
            return;
        }

        $now = Carbon::now();
        $valoracionsCreades = 0;

        // Per cada objecte, generem entre 1 i 4 valoracions completes
        foreach ($objectes as $objecte) {
            $solicitantsPossibles = $solicitants->where('id', '!=', $objecte->user_id);
            if ($solicitantsPossibles->isEmpty()) continue;

            $nValoracions = rand(1, 4);

            for ($i = 0; $i < $nValoracions; $i++) {
                $solicitant = $solicitantsPossibles->random();

                // Dates al passat: 30-60 dies enrere, 3-7 dies de durada
                $diaInici = $now->copy()->subDays(rand(30, 60));
                $durada   = rand(3, 7);
                $diaFi    = $diaInici->copy()->addDays($durada);

                // 1) Solicitud (estat finalitzat)
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

                // 2) Transacció (estat finalitzat)
                $transaccioId = DB::table('transaccions')->insertGetId([
                    'solicitud_id'    => $solicitudId,
                    'data_inici_real' => $diaInici,
                    'data_fi_real'    => $diaFi,
                    'estat'           => 'finalitzat',
                    'created_at'      => $diaInici,
                    'updated_at'      => $diaFi,
                ]);

                // 3) Valoració (puntuació entre 3 i 5)
                DB::table('valoracions')->insert([
                    'transaccio_id' => $transaccioId,
                    'autor_id'      => $solicitant->id,
                    'puntuacio'     => rand(3, 5),
                    'comentari'     => fake('ca_ES')->sentence(),
                    'created_at'    => $diaFi,
                ]);

                $valoracionsCreades++;
            }
        }

        $this->command->info("✓ {$valoracionsCreades} valoracions sintètiques creades.");
    }
}
