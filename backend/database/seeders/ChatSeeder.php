<?php

namespace Database\Seeders;

use App\Models\Objecte;
use App\Models\User;
use Carbon\Carbon;
use Database\Seeders\Support\Catalogs;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

/**
 * Genera conversaciones realistas entre usuarios. En lugar del producto
 * cartesiano (O(n²) → inviable con 300 usuarios), cada usuario inicia
 * entre 0 y 5 conversaciones aleatorias con otros usuarios.
 */
class ChatSeeder extends Seeder
{
    public function run(): void
    {
        $users = User::all();

        if ($users->count() < 2) {
            $this->command->warn('Necesitas al menos 2 usuarios.');
            return;
        }

        $now = Carbon::now();
        $userIds = $users->pluck('id')->all();

        // Pares únicos (id_petit, id_gran) → evita duplicados y respeta el CHECK
        $pairsDone = [];
        $converses = 0;
        $missatges = 0;

        foreach ($userIds as $uid) {
            $nConvs = mt_rand(0, 5);
            for ($c = 0; $c < $nConvs; $c++) {
                $otherId = $userIds[array_rand($userIds)];
                if ($otherId === $uid) continue;

                [$u1, $u2] = $uid < $otherId ? [$uid, $otherId] : [$otherId, $uid];
                $key = "{$u1}-{$u2}";
                if (isset($pairsDone[$key])) continue;
                $pairsDone[$key] = true;

                // 50% prob. de conversación con objeto de contexto
                $objecteId = null;
                if (mt_rand(0, 1) === 1) {
                    $obj = Objecte::whereIn('user_id', [$u1, $u2])->inRandomOrder()->first();
                    if ($obj) $objecteId = $obj->id;
                }

                $iniciada = $now->copy()->subDays(mt_rand(1, 60))->subHours(mt_rand(0, 23));

                $conversaId = DB::table('converses')->insertGetId([
                    'usuari_1_id' => $u1,
                    'usuari_2_id' => $u2,
                    'objecte_id'  => $objecteId,
                    'created_at'  => $iniciada,
                    'updated_at'  => $iniciada,
                ]);
                $converses++;

                $nMissatges      = mt_rand(2, 12);
                $emissor         = mt_rand(0, 1) === 0 ? $u1 : $u2;
                $timestamp       = $iniciada->copy();
                $teNoLlegits     = mt_rand(1, 100) <= 50;
                $noLlegitsCount  = $teNoLlegits ? mt_rand(1, 2) : 0;

                $rows = [];
                for ($i = 0; $i < $nMissatges; $i++) {
                    $timestamp = $timestamp->copy()->addMinutes(mt_rand(1, 360));
                    $isLast    = $i >= $nMissatges - $noLlegitsCount;
                    $llegitAt  = $isLast ? null : $timestamp->copy()->addMinutes(mt_rand(1, 30));

                    $rows[] = [
                        'conversa_id' => $conversaId,
                        'emissor_id'  => $emissor,
                        'contingut'   => Catalogs::chatMessage(),
                        'llegit_at'   => $llegitAt,
                        'created_at'  => $timestamp,
                    ];
                    $missatges++;
                    $emissor = $emissor === $u1 ? $u2 : $u1;
                }
                DB::table('missatges')->insert($rows);

                DB::table('converses')
                    ->where('id', $conversaId)
                    ->update(['updated_at' => $timestamp]);
            }
        }

        $this->command->info("✓ {$converses} conversaciones y {$missatges} mensajes creados.");
    }
}
