<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class CategoriaSeeder extends Seeder
{
    public function run(): void
    {
        $now = Carbon::now();
        $categories = [
            ['nom' => 'Viatges', 'slug' => 'viatges', 'icona' => 'plane', 'descripcio' => 'Maletes, adaptadors, accessoris de viatge i equipament per a desplaçaments'],
            ['nom' => 'Construcció', 'slug' => 'construccio', 'icona' => 'hard-hat', 'descripcio' => 'Eines de construcció, maquinària lleugera i material d\'obra'],
            ['nom' => 'Eines', 'slug' => 'eines', 'icona' => 'wrench', 'descripcio' => 'Eines manuals i elèctriques per a bricolatge i reparacions'],
            ['nom' => 'Jardineria', 'slug' => 'jardineria', 'icona' => 'flower', 'descripcio' => 'Eines de jardí, maquinària de poda i accessoris per a l\'exterior'],
            ['nom' => 'Electrodomèstics', 'slug' => 'electrodomestics', 'icona' => 'zap', 'descripcio' => 'Electrodomèstics petits i grans per a la llar'],
            ['nom' => 'Mobilitat', 'slug' => 'mobilitat', 'icona' => 'bike', 'descripcio' => 'Bicicletes, patinets, remolcs i accessoris de mobilitat'],
            ['nom' => 'Fitness', 'slug' => 'fitness', 'icona' => 'dumbbell', 'descripcio' => 'Material esportiu, peses, màquines d\'exercici i accessoris'],
            ['nom' => 'Surf', 'slug' => 'surf', 'icona' => 'waves', 'descripcio' => 'Taules de surf, neoprens, quilles i accessoris aquàtics'],
            ['nom' => 'Trones de nadó', 'slug' => 'trones-de-nado', 'icona' => 'baby', 'descripcio' => 'Trones, cotxets, cadires de passeig i material infantil'],
            ['nom' => 'Jocs de taula', 'slug' => 'jocs-de-taula',  'icona' => 'gamepad', 'descripcio' => 'Jocs de taula, jocs de cartes, puzles i entreteniment'],
        ];

        foreach ($categories as $cat) {
            DB::table('categories')->updateOrInsert(
                [
                    'nom' => $cat['nom'],
                    'slug' => $cat['slug'],
                ],
                array_merge($cat, [
                    'activa' => true,
                    'created_at' => $now,
                    'updated_at' => $now
                ])
            );
        }
    }
}
