<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Carbon\Carbon;

class CategoriaSeeder extends Seeder
{
    public function run(): void
    {
        $now = Carbon::now();

        $categories = [
            ['nom' => 'Viajes',            'icona' => 'trip',           'descripcio' => 'Maletas, adaptadores, accesorios de viaje y equipamiento para desplazamientos'],
            ['nom' => 'Construcción',      'icona' => 'construction',   'descripcio' => 'Herramientas de construcción, maquinaria ligera y material de obra'],
            ['nom' => 'Herramientas',      'icona' => 'handyman',       'descripcio' => 'Herramientas manuales y eléctricas para bricolaje y reparaciones'],
            ['nom' => 'Jardinería',        'icona' => 'grass',          'descripcio' => 'Herramientas de jardín, maquinaria de poda y accesorios para el exterior'],
            ['nom' => 'Electrodomésticos', 'icona' => 'microwave_gen',  'descripcio' => 'Electrodomésticos pequeños y grandes para el hogar'],
            ['nom' => 'Movilidad',         'icona' => 'pedal_bike',     'descripcio' => 'Bicicletas, patinetes, remolques y accesorios de movilidad'],
            ['nom' => 'Fitness',           'icona' => 'cardio_load',    'descripcio' => 'Material deportivo, pesas, máquinas de ejercicio y accesorios'],
            ['nom' => 'Surf',              'icona' => 'waves',          'descripcio' => 'Tablas de surf, neoprenos, quillas y accesorios acuáticos'],
            ['nom' => 'Bebés y niños',     'icona' => 'child_friendly', 'descripcio' => 'Tronas, cochecitos, sillas de paseo y material infantil'],
            ['nom' => 'Juegos de mesa',    'icona' => 'strategy',       'descripcio' => 'Juegos de mesa, juegos de cartas, puzles y entretenimiento'],
        ];

        foreach ($categories as $cat) {
            DB::table('categories')->updateOrInsert(
                ['nom' => $cat['nom']],
                [
                    'slug'        => Str::slug($cat['nom']),
                    'icona'       => $cat['icona'],
                    'descripcio'  => $cat['descripcio'],
                    'activa'      => true,
                    'created_at'  => $now,
                    'updated_at'  => $now,
                ]
            );
        }
    }
}
