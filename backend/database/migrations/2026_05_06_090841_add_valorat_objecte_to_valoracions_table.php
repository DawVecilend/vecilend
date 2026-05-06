<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('valoracions', function (Blueprint $table) {
            $table->foreignId('valorat_id')
                ->after('autor_id')
                ->constrained('users')
                ->cascadeOnDelete();

            $table->foreignId('objecte_id')
                ->after('valorat_id')
                ->constrained('objectes')
                ->cascadeOnDelete();

            $table->index(['valorat_id', 'created_at']);
            $table->index(['objecte_id', 'created_at']);
        });
    }

    public function down(): void
    {
        Schema::table('valoracions', function (Blueprint $table) {
            $table->dropForeign(['valorat_id']);
            $table->dropForeign(['objecte_id']);
            $table->dropIndex(['valorat_id', 'created_at']);
            $table->dropIndex(['objecte_id', 'created_at']);
            $table->dropColumn(['valorat_id', 'objecte_id']);
        });
    }
};
