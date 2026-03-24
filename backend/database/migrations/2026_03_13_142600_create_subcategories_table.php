<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('subcategories', function (Blueprint $table) {
            $table->id();
            $table->foreignId('categoria_id')->constrained('categories')->cascadeOnDelete();
            $table->string('nom', 100);
            $table->text('descripcio')->nullable();
            $table->boolean('activa')->default(true);
            $table->timestamps();
            $table->unique(['categoria_id', 'nom']);
            $table->index('categoria_id');
        });
    }

    public function down(): void {
        Schema::dropIfExists('subcategories');
    }
};
