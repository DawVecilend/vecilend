<?php

namespace Database\Seeders;

use App\Models\Objecte;
use App\Models\User;
use App\Models\Categoria;
use Illuminate\Database\Seeder;

class ObjecteSeeder extends Seeder {
    public function run(): void {
        $users = User::all();
        $categories = Categoria::all();
        if ($users->isEmpty() || $categories->isEmpty()) {
            $this->command->warn(' Executa UserSeeder i CategoriaSeeder abans.');
            return;
        }

        Objecte::factory()->count(30)->sequence(fn ($sequence) => [
            'user_id' => $users->random()->id,
            'categoria_id' => $categories->random()->id
        ])->create();
        
        $this->command->info(' 30 objectes creats amb coordenades.');
    }
}