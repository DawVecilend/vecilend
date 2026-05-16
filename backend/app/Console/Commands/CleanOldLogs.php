<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

class CleanOldLogs extends Command
{
    protected $signature = 'vecilend:clean-logs {--days=90 : Días de retención}';

    protected $description = 'Elimina logs anteriores a X días (por defecto 90).';

    public function handle(): int
    {
        $days = (int) $this->option('days');
        if ($days < 1) {
            $this->error('El número de días debe ser >= 1');
            return self::FAILURE;
        }

        $cutoff = Carbon::now()->subDays($days);
        $deleted = DB::table('logs')->where('created_at', '<', $cutoff)->delete();

        $this->info("Eliminados {$deleted} logs anteriores a {$cutoff->toDateTimeString()} ({$days} días).");

        return self::SUCCESS;
    }
}
