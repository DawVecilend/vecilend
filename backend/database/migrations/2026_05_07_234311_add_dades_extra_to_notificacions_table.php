<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('notificacions', function (Blueprint $table) {
            // JSON estructurat amb contextual data: nom autor, nom objecte,
            // objecte_id, puntuacio, etc. Així el resource no ha de fer joins.
            $table->json('dades_extra')
                ->nullable()
                ->after('id_entitat_referenciada');
        });
    }

    public function down(): void
    {
        Schema::table('notificacions', function (Blueprint $table) {
            $table->dropColumn('dades_extra');
        });
    }
};
