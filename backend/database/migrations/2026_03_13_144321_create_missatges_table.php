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
            $table->foreignId('objecte_id')->nullable()->constrained('objectes')->nullOnDelete();
            $table->foreignId('respon_a_id')->nullable()->constrained('missatges')->nullOnDelete();
            $table->foreignId('solicitud_id')->nullable()->constrained('solicituds')->nullOnDelete();
            $table->text('contingut');
            $table->timestamp('llegit_at')->nullable();
            $table->timestamp('created_at')->useCurrent();

            $table->index(['conversa_id', 'created_at']);
            $table->index(['conversa_id', 'emissor_id', 'llegit_at']);
            $table->index('objecte_id');
            $table->index('respon_a_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('missatges');
    }
};
