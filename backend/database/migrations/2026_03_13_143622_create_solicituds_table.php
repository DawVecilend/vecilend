<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('solicituds', function (Blueprint $table) {
            $table->id();
            $table->foreignId('solicitant_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('objecte_id')->constrained('objectes')->cascadeOnDelete();
            $table->date('data_inici');
            $table->date('data_fi');
            $table->text('missatge')->nullable();
            $table->string('estat', 20)->default('pendent');
            $table->timestamps();
            $table->index(['objecte_id', 'estat']);
        });
    }

    public function down(): void {
        Schema::dropIfExists('solicituds');
    }
};