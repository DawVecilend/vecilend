<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('missatges', function (Blueprint $table) {
            $table->id();
            $table->foreignId('conversa_id')->constrained('converses')->cascadeOnDelete();
            $table->foreignId('emissor_id')->constrained('users')->cascadeOnDelete();
            $table->text('contingut');
            $table->boolean('llegit')->default(false);
            $table->timestamp('created_at')->useCurrent();
            $table->index(['conversa_id', 'created_at']);
        });
    }

    public function down(): void {
        Schema::dropIfExists('missatges');
    }
};