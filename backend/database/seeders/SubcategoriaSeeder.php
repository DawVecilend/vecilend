<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Carbon\Carbon;

class SubcategoriaSeeder extends Seeder
{
    public function run(): void
    {
        $now = Carbon::now();
        $map = [
            'Viatges' => ['Maletes', 'Motxilles', 'Accessoris de viatge'],
            'Construcció' => ['Maquinària', 'Seguretat', 'Material d\'obra'],
            'Eines' => ['Manuals', 'Elèctriques', 'Mesura'],
            'Jardineria' => ['Poda', 'Reg', 'Plantació'],
            'Electrodomèstics' => ['Cuina', 'Neteja', 'Climatització'],
            'Mobilitat' => ['Bicicletes', 'Patinets', 'Accessoris'],
            'Fitness' => ['Peses', 'Cardio', 'Ioga'],
            'Surf' => ['Taules', 'Neoprens', 'Accessoris'],
            'Trones de nadó' => ['Trones', 'Cotxets', 'Seguretat infantil'],
            'Jocs de taula' => ['Estratègia', 'Cooperatius', 'Familiars'],
        ];

        foreach ($map as $nomCategoria => $subcategories) {
            $categoriaId = DB::table('categories')->where('nom', $nomCategoria)->value('id');
            if (!$categoriaId) {
                $this->command->warn(" Categoria '{$nomCategoria}' no trobada. Executa CategoriaSeeder primer.");
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
