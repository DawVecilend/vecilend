<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

return new class extends Migration {
    public function up(): void
    {
        $now = now();

        $catRenames = [
            'Viatges'           => 'Viajes',
            'Construcció'       => 'Construcción',
            'Eines'             => 'Herramientas',
            'Jardineria'        => 'Jardinería',
            'Electrodomèstics'  => 'Electrodomésticos',
            'Mobilitat'         => 'Movilidad',
            'Trones de nadó'    => 'Bebés y niños',
            'Jocs de taula'     => 'Juegos de mesa',
        ];

        foreach ($catRenames as $old => $new) {
            DB::table('categories')->where('nom', $old)->update([
                'nom' => $new, 'slug' => Str::slug($new), 'updated_at' => $now,
            ]);
        }

        $subRenames = [
            'Maletes' => 'Maletas', 'Motxilles' => 'Mochilas',
            'Accessoris de viatge' => 'Accesorios de viaje',
            'Maquinària' => 'Maquinaria', 'Seguretat' => 'Seguridad',
            "Material d'obra" => 'Material de obra',
            'Manuals' => 'Manuales', 'Elèctriques' => 'Eléctricas',
            'Mesura' => 'Medición', 'Reg' => 'Riego', 'Plantació' => 'Plantación',
            'Cuina' => 'Cocina', 'Neteja' => 'Limpieza', 'Climatització' => 'Climatización',
            'Bicicletes' => 'Bicicletas', 'Patinets' => 'Patinetes',
            'Accessoris' => 'Accesorios', 'Peses' => 'Pesas', 'Ioga' => 'Yoga',
            'Taules' => 'Tablas', 'Neoprens' => 'Neoprenos',
            'Trones' => 'Tronas', 'Cotxets' => 'Cochecitos',
            'Seguretat infantil' => 'Seguridad infantil',
            'Estratègia' => 'Estrategia', 'Cooperatius' => 'Cooperativos',
            'Familiars' => 'Familiares',
        ];

        foreach ($subRenames as $old => $new) {
            DB::table('subcategories')->where('nom', $old)->update([
                'nom' => $new, 'slug' => Str::slug($new), 'updated_at' => $now,
            ]);
        }
    }

    public function down(): void
    {
        // No revertimos, los seeders contienen los nombres correctos
    }
};
