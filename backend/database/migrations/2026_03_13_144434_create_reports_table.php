<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('reports', function (Blueprint $table) {
            $table->id();
            $table->foreignId('reportador_id')->constrained('users')->cascadeOnDelete();
            $table->string('tipus_reportat', 20); // 'objecte' | 'usuari'
            $table->unsignedBigInteger('id_reportat');
            $table->string('motiu', 50); // 'contingut_inadequat'|'frau'|'spam'|'altre'
            $table->text('descripcio');
            $table->string('estat', 20)->default('pendent');
            $table->foreignId('admin_revisor_id')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
            $table->index('estat');
            $table->index(['tipus_reportat', 'id_reportat']);
        });
    }
    
    public function down(): void {
        Schema::dropIfExists('reports');
    }
};