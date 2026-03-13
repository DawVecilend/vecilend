<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('nom', 100);
            $table->string('cognoms', 150);
            $table->string('email', 255)->unique();
            $table->string('password', 255)->nullable(); // nullable per Google OAuth
            $table->string('avatar_url', 500)->nullable();
            $table->string('google_id', 100)->unique()->nullable();
            $table->geography('ubicacio', subtype: 'point', srid: 4326)->nullable(); // PostGIS SRID 4326
            $table->integer('radi_proximitat')->default(5); // km, rang 1-50
            $table->string('rol', 20)->default('usuari'); // 'usuari' | 'admin'
            $table->boolean('actiu')->default(true);
            $table->timestamp('email_verified_at')->nullable();
            $table->rememberToken();
            $table->timestamps();
            $table->spatialIndex('ubicacio');
        });

        Schema::create('password_reset_tokens', function (Blueprint $table) {
            $table->string('email')->primary();
            $table->string('token');
            $table->timestamp('created_at')->nullable();
        });

        Schema::create('sessions', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->foreignId('user_id')->nullable()->index();
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->longText('payload');
            $table->integer('last_activity')->index();
        });
    }

    public function down(): void {
        Schema::dropIfExists('sessions');
        Schema::dropIfExists('password_reset_tokens');
        Schema::dropIfExists('users');
    }
};