<?php

namespace Database\Seeders;

use App\Models\Notificacio;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Carbon;

class NotificacioSeeder extends Seeder
{
    public function run(): void
    {
        $users   = User::where('rol', '!=', 'admin')->get();

        if ($users->isEmpty()) {
            $this->command->warn('Necessites com a mínim un usuari no admin.');
            return;
        }

        $now     = Carbon::now();
        $creades = 0;

        foreach ($users as $user) {

            // ── Solicituds rebudes com a propietari (amb join al solicitant) ──
            $solicitudsRebudes = DB::table('solicituds')
                ->join('objectes', 'objectes.id', '=', 'solicituds.objecte_id')
                ->join('users as solicitant', 'solicitant.id', '=', 'solicituds.solicitant_id')
                ->where('objectes.user_id', $user->id)
                ->select(
                    'solicituds.id',
                    'solicituds.created_at',
                    'solicituds.data_inici',
                    'solicituds.data_fi',
                    'objectes.id as objecte_id',
                    'objectes.nom as objecte_nom',
                    'solicitant.id as solicitant_id',
                    'solicitant.nom as solicitant_nom',
                    'solicitant.username as solicitant_username',
                )
                ->get();

            // ── Solicituds enviades com a sol·licitant (amb join al propietari) ──
            $solicitudsEnviades = DB::table('solicituds')
                ->join('objectes', 'objectes.id', '=', 'solicituds.objecte_id')
                ->join('users as propietari', 'propietari.id', '=', 'objectes.user_id')
                ->where('solicituds.solicitant_id', $user->id)
                ->select(
                    'solicituds.id',
                    'solicituds.created_at',
                    'objectes.id as objecte_id',
                    'objectes.nom as objecte_nom',
                    'propietari.id as propietari_id',
                    'propietari.nom as propietari_nom',
                    'propietari.username as propietari_username',
                )
                ->get();

            // ── Valoracions rebudes (amb join a l'autor i l'objecte) ──
            $valoracionsRebudes = DB::table('valoracions')
                ->join('users as autor', 'autor.id', '=', 'valoracions.autor_id')
                ->leftJoin('objectes', 'objectes.id', '=', 'valoracions.objecte_id')
                ->where('valoracions.valorat_id', $user->id)
                ->select(
                    'valoracions.id',
                    'valoracions.created_at',
                    'valoracions.puntuacio',
                    'autor.id as autor_id',
                    'autor.nom as autor_nom',
                    'autor.username as autor_username',
                    'objectes.id as objecte_id',
                    'objectes.nom as objecte_nom',
                )
                ->get();

            // ── solicitud_rebuda (fins a 2 per usuari) ──
            foreach ($solicitudsRebudes->shuffle()->take(2) as $s) {
                $dies = $this->calcDies($s->data_inici, $s->data_fi);
                DB::table('notificacions')->insert([
                    'user_id'                 => $user->id,
                    'tipus'                   => Notificacio::TIPUS_SOLICITUD_REBUDA,
                    'titol'                   => 'Nueva solicitud',
                    'missatge'                => "{$s->solicitant_nom} ha solicitado tu objeto «{$s->objecte_nom}».",
                    'entitat_referenciada'    => 'solicitud',
                    'id_entitat_referenciada' => $s->id,
                    'dades_extra'             => json_encode([
                        'autor_id'       => $s->solicitant_id,
                        'autor_nom'      => $s->solicitant_nom,
                        'autor_username' => $s->solicitant_username,
                        'objecte_id'     => $s->objecte_id,
                        'objecte_nom'    => $s->objecte_nom,
                        'data_inici'     => $s->data_inici,
                        'data_fi'        => $s->data_fi,
                        'dies'           => $dies,
                    ]),
                    'llegida'                 => rand(1, 100) <= 40,
                    'created_at'              => Carbon::parse($s->created_at)->addMinutes(rand(1, 60)),
                ]);
                $creades++;
            }

            // ── solicitud_acceptada (fins a 2 per usuari) ──
            foreach ($solicitudsEnviades->shuffle()->take(2) as $s) {
                DB::table('notificacions')->insert([
                    'user_id'                 => $user->id,
                    'tipus'                   => Notificacio::TIPUS_SOLICITUD_ACCEPTADA,
                    'titol'                   => 'Solicitud aceptada',
                    'missatge'                => "{$s->propietari_nom} ha aceptado tu solicitud sobre «{$s->objecte_nom}».",
                    'entitat_referenciada'    => 'solicitud',
                    'id_entitat_referenciada' => $s->id,
                    'dades_extra'             => json_encode([
                        'autor_id'       => $s->propietari_id,
                        'autor_nom'      => $s->propietari_nom,
                        'autor_username' => $s->propietari_username,
                        'objecte_id'     => $s->objecte_id,
                        'objecte_nom'    => $s->objecte_nom,
                    ]),
                    'llegida'                 => rand(1, 100) <= 60,
                    'created_at'              => Carbon::parse($s->created_at)->addHours(rand(1, 24)),
                ]);
                $creades++;
            }

            // ── solicitud_rebutjada (~50% dels usuaris) ──
            if (rand(1, 100) <= 50 && $solicitudsEnviades->isNotEmpty()) {
                $s = $solicitudsEnviades->random();
                DB::table('notificacions')->insert([
                    'user_id'                 => $user->id,
                    'tipus'                   => Notificacio::TIPUS_SOLICITUD_REBUTJADA,
                    'titol'                   => 'Solicitud rechazada',
                    'missatge'                => "{$s->propietari_nom} ha rechazado tu solicitud sobre «{$s->objecte_nom}».",
                    'entitat_referenciada'    => 'solicitud',
                    'id_entitat_referenciada' => $s->id,
                    'dades_extra'             => json_encode([
                        'autor_id'       => $s->propietari_id,
                        'autor_nom'      => $s->propietari_nom,
                        'autor_username' => $s->propietari_username,
                        'objecte_id'     => $s->objecte_id,
                        'objecte_nom'    => $s->objecte_nom,
                    ]),
                    'llegida'                 => rand(1, 100) <= 70,
                    'created_at'              => $now->copy()->subDays(rand(2, 60))->subHours(rand(0, 23)),
                ]);
                $creades++;
            }

            // ── valoracio_rebuda (fins a 3 per usuari) ──
            foreach ($valoracionsRebudes->shuffle()->take(3) as $v) {
                DB::table('notificacions')->insert([
                    'user_id'                 => $user->id,
                    'tipus'                   => Notificacio::TIPUS_VALORACIO_REBUDA,
                    'titol'                   => 'Nueva valoración',
                    'missatge'                => "{$v->autor_nom} te ha valorado.",
                    'entitat_referenciada'    => 'valoracio',
                    'id_entitat_referenciada' => $v->id,
                    'dades_extra'             => json_encode([
                        'autor_id'       => $v->autor_id,
                        'autor_nom'      => $v->autor_nom,
                        'autor_username' => $v->autor_username,
                        'puntuacio'      => (int) $v->puntuacio,
                        'objecte_id'     => $v->objecte_id,
                        'objecte_nom'    => $v->objecte_nom,
                    ]),
                    'llegida'                 => rand(1, 100) <= 50,
                    'created_at'              => Carbon::parse($v->created_at)->addMinutes(rand(1, 60)),
                ]);
                $creades++;
            }
        }

        $this->command->info("✓ {$creades} notificacions sintètiques creades (amb dades_extra).");
    }

    private function calcDies(?string $inici, ?string $fi): int
    {
        if (!$inici || !$fi) return 1;
        return (int) abs(Carbon::parse($inici)->diffInDays(Carbon::parse($fi))) + 1;
    }
}
