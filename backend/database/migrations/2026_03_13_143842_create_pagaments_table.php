<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('pagaments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('transaccio_id')->constrained('transaccions')->cascadeOnDelete();
            $table->foreignId('pagador_id')->constrained('users')->cascadeOnDelete();
            $table->string('tipus', 20); // 'diposit' | 'asseguranca' | 'lloguer'
            $table->decimal('import', 10, 2);
            $table->string('estat', 20)->default('pendent');
            $table->string('metode_pagament', 30); // 'targeta_mock'|'transferencia_mock'|'paypal_mock'
            $table->string('referencia_mock', 100)->unique();
            $table->text('notes')->nullable();
            $table->timestamps();
            $table->index('transaccio_id');
        });
    }
    
    public function down(): void {
        Schema::dropIfExists('pagaments');
    }
};