<?php

namespace Database\Seeders;

use App\Models\Notificacio;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Carbon;

/**
 * Genera notificacions sintètiques per a cada usuari, amb mescla dels
 * 4 tipus suportats i un % d'unread per provar la bombolla de la campana.
 *
 * Es lliga a entitats reals (solicituds, valoracions) sempre que es pot,
 * així els enllaços del frontend porten a llocs vàlids.
 */
class NotificacioSeeder extends Seeder
{
    public function run(): void
    {
        $users = User::where('rol', '!=', 'admin')->get();

        if ($users->isEmpty()) {
            $this->command->warn('Necessites com a mínim un usuari no admin.');
            return;
        }

        $now     = Carbon::now();
        $creades = 0;

        foreach ($users as $user) {
            // Solicituds rebudes com a propietari
            $solicitudsRebudes = DB::table('solicituds')
                ->join('objectes', 'objectes.id', '=', 'solicituds.objecte_id')
                ->where('objectes.user_id', $user->id)
                ->select('solicituds.id', 'solicituds.created_at')
                ->get();

            // Solicituds enviades com a sol·licitant
            $solicitudsEnviades = DB::table('solicituds')
                ->where('solicitant_id', $user->id)
                ->select('id', 'created_at')
                ->get();

            // Valoracions rebudes
            $valoracionsRebudes = DB::table('valoracions')
                ->where('valorat_id', $user->id)
                ->select('id', 'created_at')
                ->get();

            // ── Solicitud rebuda (fins a 2 per usuari) ──
            foreach ($solicitudsRebudes->shuffle()->take(2) as $s) {
                DB::table('notificacions')->insert([
                    'user_id'                 => $user->id,
                    'tipus'                   => Notificacio::TIPUS_SOLICITUD_REBUDA,
                    'titol'                   => 'Nueva solicitud',
                    'missatge'                => 'Has recibido una solicitud para uno de tus objetos.',
                    'entitat_referenciada'    => 'solicitud',
                    'id_entitat_referenciada' => $s->id,
                    'llegida'                 => rand(1, 100) <= 40,
                    'created_at'              => Carbon::parse($s->created_at)->addMinutes(rand(1, 60)),
                ]);
                $creades++;
            }

            // ── Solicitud acceptada (fins a 2 per usuari) ──
            foreach ($solicitudsEnviades->shuffle()->take(2) as $s) {
                DB::table('notificacions')->insert([
                    'user_id'                 => $user->id,
                    'tipus'                   => Notificacio::TIPUS_SOLICITUD_ACCEPTADA,
                    'titol'                   => 'Solicitud aceptada',
                    'missatge'                => 'El propietario ha aceptado tu solicitud.',
                    'entitat_referenciada'    => 'solicitud',
                    'id_entitat_referenciada' => $s->id,
                    'llegida'                 => rand(1, 100) <= 60,
                    'created_at'              => Carbon::parse($s->created_at)->addHours(rand(1, 24)),
                ]);
                $creades++;
            }

            // ── Solicitud rebutjada (~50% dels usuaris en tenen alguna) ──
            if (rand(1, 100) <= 50 && $solicitudsEnviades->isNotEmpty()) {
                $s = $solicitudsEnviades->random();
                DB::table('notificacions')->insert([
                    'user_id'                 => $user->id,
                    'tipus'                   => Notificacio::TIPUS_SOLICITUD_REBUTJADA,
                    'titol'                   => 'Solicitud rechazada',
                    'missatge'                => 'El propietario ha rechazado tu solicitud.',
                    'entitat_referenciada'    => 'solicitud',
                    'id_entitat_referenciada' => $s->id,
                    'llegida'                 => rand(1, 100) <= 70,
                    'created_at'              => $now->copy()->subDays(rand(2, 60))->subHours(rand(0, 23)),
                ]);
                $creades++;
            }

            // ── Valoració rebuda (fins a 3 per usuari) ──
            foreach ($valoracionsRebudes->shuffle()->take(3) as $v) {
                DB::table('notificacions')->insert([
                    'user_id'                 => $user->id,
                    'tipus'                   => Notificacio::TIPUS_VALORACIO_REBUDA,
                    'titol'                   => 'Nueva valoración',
                    'missatge'                => 'Te han dejado una nueva valoración.',
                    'entitat_referenciada'    => 'valoracio',
                    'id_entitat_referenciada' => $v->id,
                    'llegida'                 => rand(1, 100) <= 50,
                    'created_at'              => Carbon::parse($v->created_at)->addMinutes(rand(1, 60)),
                ]);
                $creades++;
            }
        }

        $this->command->info("✓ {$creades} notificacions sintètiques creades.");
    }
}
