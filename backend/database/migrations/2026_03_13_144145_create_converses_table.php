<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration {
    public function up(): void {
        Schema::create('converses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('usuari_1_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('usuari_2_id')->constrained('users')->cascadeOnDelete();
            $table->timestamps();
            $table->unique(['usuari_1_id', 'usuari_2_id']);
        });

        // CHECK constraint: usuari_1_id < usuari_2_id per evitar duplicats invertits
        DB::statement('ALTER TABLE converses ADD CONSTRAINT chk_conversa_ordre CHECK (usuari_1_id < usuari_2_id)');
    }
    
    public function down(): void {
        Schema::dropIfExists('converses');
    }
};