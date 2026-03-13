<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('tipus', 20); // 'admin' | 'usuari' | 'sistema'
            $table->string('accio', 100);
            $table->jsonb('detall')->nullable();
            $table->string('entitat_afectada', 50)->nullable();
            $table->unsignedBigInteger('id_entitat_afectada')->nullable();
            $table->string('ip', 45)->nullable();
            $table->timestamp('created_at')->useCurrent();
            $table->index('created_at');
            $table->index('user_id');
            $table->index('tipus');
        });
    }

    public function down(): void {
        Schema::dropIfExists('logs');
    }
};