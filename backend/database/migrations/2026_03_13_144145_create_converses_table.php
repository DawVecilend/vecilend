<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('converses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('usuari_1_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('usuari_2_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('objecte_id')->nullable()->constrained('objectes')->nullOnDelete();
            $table->timestamps();

            // Una sola conversa per parell d'usuaris (independentment de l'objecte de context)
            $table->unique(['usuari_1_id', 'usuari_2_id']);

            // Per ordenar el llistat per últim missatge fem servir updated_at com a fallback
            $table->index('updated_at');
        });

        // Garanteix que sempre usuari_1_id < usuari_2_id (evita duplicats reverse)
        DB::statement('ALTER TABLE converses ADD CONSTRAINT chk_conversa_ordre CHECK (usuari_1_id < usuari_2_id)');
    }

    public function down(): void
    {
        Schema::dropIfExists('converses');
    }
};
