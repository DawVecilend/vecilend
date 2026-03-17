<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('imatges_objecte', function (Blueprint $table) {
            $table->id();
            $table->foreignId('objecte_id')->constrained('objectes')->cascadeOnDelete();
            $table->string('url_cloudinary', 500);
            $table->string('public_id_cloudinary', 255);
            $table->integer('ordre')->default(0);
            $table->timestamp('created_at')->useCurrent();
            $table->index('objecte_id');
        });
    }

    public function down(): void {
        Schema::dropIfExists('imatges_objecte');
    }
};