<?php

namespace Database\Seeders;

use App\Models\Objecte;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Carbon;

/**
 * Genera converses i missatges entre usuaris per poblar els chats mock.
 * Algunes converses tenen un objecte de context, algunes no.
 * Algunes deixen missatges sense llegir per provar les bombolles.
 */
class ChatSeeder extends Seeder
{
    /**
     * Plantilles en castellà — coincideix amb l'idioma de la UI.
     */
    private array $templates = [
        '¡Hola! He visto tu objeto, ¿sigue disponible?',
        'Buenas, ¿podríamos quedar mañana por la tarde?',
        'Perfecto, te lo confirmo en un rato.',
        'Sí, claro, sin problema.',
        '¿En qué horario te va mejor?',
        'Te lo agradezco mucho 🙌',
        'Genial, nos vemos entonces.',
        '¿Lo necesitas con algún accesorio extra?',
        'Te paso mi ubicación más tarde.',
        'Muchas gracias, ya te aviso cuando llegue.',
        'Ok, perfecto.',
        'Al final me surge un imprevisto, ¿podemos cambiar la hora?',
        'No te preocupes, lo dejamos para otro día.',
        '¿Cuántos días lo necesitas?',
        'Gracias por la rápida respuesta.',
    ];

    public function run(): void
    {
        $users = User::where('rol', '!=', 'admin')->get();

        if ($users->count() < 2) {
            $this->command->warn('Necessites com a mínim 2 usuaris no admin.');
            return;
        }

        $now = Carbon::now();

        // Tots els parells canònics (id_petit < id_gran) per respectar el CHECK
        $userIds = $users->pluck('id')->sort()->values()->all();
        $pairs   = [];
        for ($i = 0; $i < count($userIds); $i++) {
            for ($j = $i + 1; $j < count($userIds); $j++) {
                $pairs[] = [$userIds[$i], $userIds[$j]];
            }
        }

        // Conversa per a ~80% dels parells
        $pairs = array_values(array_filter($pairs, fn() => rand(1, 100) <= 80));

        $converses = 0;
        $missatges = 0;

        foreach ($pairs as [$u1, $u2]) {
            // 50% de probabilitat de tenir un objecte de context
            $objecteId = null;
            if (rand(0, 1) === 1) {
                $obj = Objecte::whereIn('user_id', [$u1, $u2])->inRandomOrder()->first();
                if ($obj) {
                    $objecteId = $obj->id;
                }
            }

            $iniciada = $now->copy()->subDays(rand(1, 30))->subHours(rand(0, 23));

            $conversaId = DB::table('converses')->insertGetId([
                'usuari_1_id' => $u1,
                'usuari_2_id' => $u2,
                'objecte_id'  => $objecteId,
                'created_at'  => $iniciada,
                'updated_at'  => $iniciada,
            ]);
            $converses++;

            // Entre 2 i 10 missatges, alternant emissor
            $nMissatges = rand(2, 10);
            $emissor    = rand(0, 1) === 0 ? $u1 : $u2;
            $timestamp  = $iniciada->copy();

            // ~50% de converses tenen els últims 1-2 missatges sense llegir
            $teNoLlegits     = rand(1, 100) <= 50;
            $noLlegitsCount  = $teNoLlegits ? rand(1, 2) : 0;

            for ($i = 0; $i < $nMissatges; $i++) {
                // Avança el temps (1 min – 6h entre missatges)
                $timestamp = $timestamp->copy()->addMinutes(rand(1, 360));

                $isLast   = $i >= $nMissatges - $noLlegitsCount;
                $llegitAt = $isLast ? null : $timestamp->copy()->addMinutes(rand(1, 30));

                DB::table('missatges')->insert([
                    'conversa_id' => $conversaId,
                    'emissor_id'  => $emissor,
                    'contingut'   => $this->templates[array_rand($this->templates)],
                    'llegit_at'   => $llegitAt,
                    'created_at'  => $timestamp,
                ]);
                $missatges++;

                $emissor = $emissor === $u1 ? $u2 : $u1;
            }

            // updated_at de la conversa = data de l'últim missatge (per ordenar el llistat)
            DB::table('converses')
                ->where('id', $conversaId)
                ->update(['updated_at' => $timestamp]);
        }

        $this->command->info("✓ {$converses} converses i {$missatges} missatges creats.");
    }
}
