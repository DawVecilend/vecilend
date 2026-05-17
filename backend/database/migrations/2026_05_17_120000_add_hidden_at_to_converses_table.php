<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('converses', function (Blueprint $table) {
            $table->timestamp('usuari_1_hidden_at')->nullable()->after('objecte_id');
            $table->timestamp('usuari_2_hidden_at')->nullable()->after('usuari_1_hidden_at');
        });
    }

    public function down(): void
    {
        Schema::table('converses', function (Blueprint $table) {
            $table->dropColumn(['usuari_1_hidden_at', 'usuari_2_hidden_at']);
        });
    }
};
