<?php

namespace Database\Seeders;

use App\Models\Objecte;
use App\Models\User;
use App\Models\Categoria;
use App\Models\Subcategoria;
use Illuminate\Database\Seeder;

class ObjecteSeeder extends Seeder
{
    public function run(): void
    {
        $users = User::all();
        $categories = Categoria::all();
        $subcategories = Subcategoria::all();

        if ($users->isEmpty() || $categories->isEmpty() || $subcategories->isEmpty()) {
            $this->command->warn(' Executa UserSeeder, CategoriaSeeder i SubcategoriaSeeder abans.');
            return;
        }

        Objecte::factory()->count(30)->sequence(function ($sequence) use ($users, $categories, $subcategories) {
            $categoria = $categories->random();
            $subcategoria = $subcategories->where('categoria_id', $categoria->id)->random();

            return [
                'user_id'         => $users->random()->id,
                'categoria_id'    => $categoria->id,
                'subcategoria_id' => $subcategoria->id,
            ];
        })->create();

        $this->command->info(' 30 objectes creats amb coordenades.');
    }
}
