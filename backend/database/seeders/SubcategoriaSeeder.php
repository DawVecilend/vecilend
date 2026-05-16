<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Carbon\Carbon;

class SubcategoriaSeeder extends Seeder
{
    public function run(): void
    {
        $now = Carbon::now();

        $map = [
            'Viajes'            => ['Maletas', 'Mochilas', 'Accesorios de viaje'],
            'Construcción'      => ['Maquinaria', 'Seguridad', 'Material de obra'],
            'Herramientas'      => ['Manuales', 'Eléctricas', 'Medición'],
            'Jardinería'        => ['Poda', 'Riego', 'Plantación'],
            'Electrodomésticos' => ['Cocina', 'Limpieza', 'Climatización'],
            'Movilidad'         => ['Bicicletas', 'Patinetes', 'Accesorios'],
            'Fitness'           => ['Pesas', 'Cardio', 'Yoga'],
            'Surf'              => ['Tablas', 'Neoprenos', 'Accesorios'],
            'Bebés y niños'     => ['Tronas', 'Cochecitos', 'Seguridad infantil'],
            'Juegos de mesa'    => ['Estrategia', 'Cooperativos', 'Familiares'],
        ];

        foreach ($map as $nomCategoria => $subcategories) {
            $categoriaId = DB::table('categories')->where('nom', $nomCategoria)->value('id');
            if (!$categoriaId) {
                $this->command->warn("Categoría '{$nomCategoria}' no encontrada. Ejecuta CategoriaSeeder primero.");
                continue;
            }

            foreach ($subcategories as $nomSub) {
                DB::table('subcategories')->updateOrInsert(
                    ['categoria_id' => $categoriaId, 'nom' => $nomSub],
                    [
                        'slug'       => Str::slug($nomSub),
                        'descripcio' => null,
                        'activa'     => true,
                        'created_at' => $now,
                        'updated_at' => $now,
                    ]
                );
            }
        }
    }
}
