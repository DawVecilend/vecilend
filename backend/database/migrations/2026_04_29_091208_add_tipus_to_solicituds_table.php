<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('solicituds', function (Blueprint $table) {
            // 'prestec' o 'lloguer'
            $table->string('tipus', 20)->after('data_fi');
        });
    }

    public function down(): void
    {
        Schema::table('solicituds', function (Blueprint $table) {
            $table->dropColumn('tipus');
        });
    }
};
