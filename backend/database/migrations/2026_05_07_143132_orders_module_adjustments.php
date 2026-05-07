<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // ── 1. solicituds: registres antics 'finalitzat' --> 'acceptat' ──────────
        // El cicle de vida ara el porta la Transaccio.
        DB::table('solicituds')
            ->where('estat', 'finalitzat')
            ->update(['estat' => 'acceptat']);

        // ── 2. transaccions.data_inici_real --> nullable ─────────────────────────
        Schema::table('transaccions', function (Blueprint $table) {
            $table->timestamp('data_inici_real')->nullable()->change();
        });
    }

    public function down(): void
    {
        Schema::table('transaccions', function (Blueprint $table) {
            $table->timestamp('data_inici_real')->nullable(false)->change();
        });
    }
};
