<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

class CleanEmptyConversations extends Command
{
    protected $signature = 'vecilend:clean-empty-conversations {--hours=24 : Edad mínima en horas}';

    protected $description = 'Elimina conversaciones sin ningún mensaje creadas hace más de X horas (24 por defecto).';

    public function handle(): int
    {
        $hours = (int) $this->option('hours');
        if ($hours < 1) {
            $this->error('El número de horas debe ser >= 1');
            return self::FAILURE;
        }

        $cutoff = Carbon::now()->subHours($hours);

        $deleted = DB::table('converses')
            ->where('created_at', '<', $cutoff)
            ->whereNotExists(function ($q) {
                $q->select(DB::raw(1))
                    ->from('missatges')
                    ->whereColumn('missatges.conversa_id', 'converses.id');
            })
            ->delete();

        $this->info("Eliminadas {$deleted} conversaciones sin mensajes anteriores a {$cutoff->toDateTimeString()} ({$hours} horas).");

        return self::SUCCESS;
    }
}
