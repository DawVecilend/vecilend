<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('missatges', function (Blueprint $table) {
            // Context d'objecte: si la conversa salta entre objectes diferents,
            // cada bloc de missatges queda lligat a la solicitud que el va originar.
            $table->foreignId('objecte_id')
                ->nullable()
                ->after('emissor_id')
                ->constrained('objectes')
                ->nullOnDelete();

            // Respondre/citar un missatge anterior. Si l'original es borra,
            // posem null per no perdre la cita.
            $table->foreignId('respon_a_id')
                ->nullable()
                ->after('objecte_id')
                ->constrained('missatges')
                ->nullOnDelete();

            $table->index('objecte_id');
            $table->index('respon_a_id');
        });
    }

    public function down(): void
    {
        Schema::table('missatges', function (Blueprint $table) {
            $table->dropForeign(['objecte_id']);
            $table->dropForeign(['respon_a_id']);
            $table->dropIndex(['objecte_id']);
            $table->dropIndex(['respon_a_id']);
            $table->dropColumn(['objecte_id', 'respon_a_id']);
        });
    }
};
