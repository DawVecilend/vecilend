<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('valoracions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('transaccio_id')->constrained('transaccions')->cascadeOnDelete();
            $table->foreignId('autor_id')->constrained('users')->cascadeOnDelete();
            $table->unsignedTinyInteger('puntuacio');
            $table->text('comentari')->nullable();
            $table->timestamp('created_at')->useCurrent();
            $table->unique(['transaccio_id', 'autor_id']);
            $table->index('transaccio_id');
        });
    }

    public function down(): void {
        Schema::dropIfExists('valoracions');
    }
};