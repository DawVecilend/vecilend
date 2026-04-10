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
            ['nom' => 'Viatges', 'icona' => 'plane', 'descripcio' => 'Maletes, adaptadors, accessoris de viatge i equipament per a desplaçaments'],
            ['nom' => 'Construcció', 'icona' => 'hard-hat', 'descripcio' => 'Eines de construcció, maquinària lleugera i material d\'obra'],
            ['nom' => 'Eines', 'icona' => 'wrench', 'descripcio' => 'Eines manuals i elèctriques per a bricolatge i reparacions'],
            ['nom' => 'Jardineria', 'icona' => 'flower', 'descripcio' => 'Eines de jardí, maquinària de poda i accessoris per a l\'exterior'],
            ['nom' => 'Electrodomèstics', 'icona' => 'zap', 'descripcio' => 'Electrodomèstics petits i grans per a la llar'],
            ['nom' => 'Mobilitat', 'icona' => 'bike', 'descripcio' => 'Bicicletes, patinets, remolcs i accessoris de mobilitat'],
            ['nom' => 'Fitness', 'icona' => 'dumbbell', 'descripcio' => 'Material esportiu, peses, màquines d\'exercici i accessoris'],
            ['nom' => 'Surf', 'icona' => 'waves', 'descripcio' => 'Taules de surf, neoprens, quilles i accessoris aquàtics'],
            ['nom' => 'Trones de nadó', 'icona' => 'baby', 'descripcio' => 'Trones, cotxets, cadires de passeig i material infantil'],
            ['nom' => 'Jocs de taula', 'icona' => 'gamepad', 'descripcio' => 'Jocs de taula, jocs de cartes, puzles i entreteniment'],
        ];

        foreach ($categories as $cat) {
            DB::table('categories')->updateOrInsert(
                ['nom' => $cat['nom']],
                array_merge($cat, [
                    'slug' => Str::slug($cat['nom']),
                    'activa' => true,
                    'created_at' => $now,
                    'updated_at' => $now,
                ])
            );
        }
    }
}