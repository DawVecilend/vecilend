<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('transaccions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('solicitud_id')->unique()->constrained('solicituds')->cascadeOnDelete();
            $table->timestamp('data_inici_real');
            $table->timestamp('data_fi_real')->nullable();
            $table->string('estat', 20)->default('en_curs');
            $table->timestamps();
        });
    }

    public function down(): void {
        Schema::dropIfExists('transaccions');
    }
};