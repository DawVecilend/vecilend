<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Schedule::command('vecilend:cancel-expired')->dailyAt('03:30');
Schedule::command('vecilend:clean-logs --days=90')->dailyAt('04:00');
Schedule::command('vecilend:clean-empty-conversations --hours=24')->dailyAt('04:15');
