<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration {
    public function up(): void {
        Schema::create('notificacions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->string('tipus', 50);
            $table->string('titol', 200);
            $table->text('missatge');
            $table->string('entitat_referenciada', 50)->nullable();
            $table->unsignedBigInteger('id_entitat_referenciada')->nullable();
            $table->boolean('llegida')->default(false);
            $table->timestamp('created_at')->useCurrent();
            $table->index(['user_id', 'llegida']);
        });
    }

    public function down(): void {
        Schema::dropIfExists('notificacions');
    }
};