<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('empleats', function (Blueprint $table) {
            $table->id();
            $table->string('username', 100)->unique();
            $table->string('nom', 100);
            $table->string('cognoms', 150);
            $table->string('email', 255)->unique();
            $table->string('password', 255);
            $table->string('rol', 20);
            $table->boolean('actiu')->default(true);
            $table->rememberToken();
            $table->timestamps();
            $table->index('rol');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('empleats');
    }
};
