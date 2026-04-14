<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

return new class extends Migration {
    public function up(): void
    {
        // 1. Afegir la columna (nullable temporalment per poder emplenar)
        Schema::table('categories', function (Blueprint $table) {
            $table->string('slug', 120)->nullable()->after('nom');
        });

        // 2. Generar slugs per a les categories existents
        $categories = DB::table('categories')->get();
        foreach ($categories as $cat) {
            DB::table('categories')
                ->where('id', $cat->id)
                ->update(['slug' => Str::slug($cat->nom)]);
        }

        // 3. Fer la columna NOT NULL un cop totes tenen valor
        Schema::table('categories', function (Blueprint $table) {
            $table->string('slug', 120)->nullable(false)->unique()->change();
        });
    }

    public function down(): void
    {
        Schema::table('categories', function (Blueprint $table) {
            $table->dropColumn('slug');
        });
    }
};
