<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('objectes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('categoria_id')->constrained('categories')->restrictOnDelete();
            $table->foreignId('subcategoria_id')->constrained('subcategories')->restrictOnDelete();
            $table->string('nom', 200);
            $table->string('slug', 250);
            $table->text('descripcio');
            $table->string('tipus', 20);
            $table->decimal('preu_diari', 8, 2)->nullable();
            $table->string('estat', 20)->default('disponible');
            $table->geography('ubicacio', subtype: 'point', srid: 4326);
            $table->timestamps();
            $table->spatialIndex('ubicacio');
            $table->index('categoria_id');
            $table->index('subcategoria_id');
            $table->index('estat');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('objectes');
    }
};
