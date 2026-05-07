<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('missatges', function (Blueprint $table) {
            $table->id();
            $table->foreignId('conversa_id')->constrained('converses')->cascadeOnDelete();
            $table->foreignId('emissor_id')->constrained('users')->cascadeOnDelete();
            $table->text('contingut');
            $table->timestamp('llegit_at')->nullable();
            $table->timestamp('created_at')->useCurrent();

            // Llistar missatges per conversa ordenats per data
            $table->index(['conversa_id', 'created_at']);

            // Comptar no llegits per receptor (per a la bombolla i el llistat)
            $table->index(['conversa_id', 'emissor_id', 'llegit_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('missatges');
    }
};
