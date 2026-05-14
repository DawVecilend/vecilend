<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('reports', function (Blueprint $table) {
            $table->id();
            $table->foreignId('reportador_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('usuari_reportat_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('objecte_id')->nullable()->constrained('objectes')->nullOnDelete();
            $table->string('motiu', 50);
            $table->text('descripcio')->nullable();
            $table->string('estat', 20)->default('pendent');
            $table->foreignId('revisor_id')->nullable()->constrained('empleats')->nullOnDelete();
            $table->text('resolucio_nota')->nullable();
            $table->timestamp('resolt_at')->nullable();
            $table->timestamps();
            $table->index('estat');
            $table->index('usuari_reportat_id');
            $table->index('objecte_id');
        });
    }

    public function down(): void {
        Schema::dropIfExists('reports');
    }
};
