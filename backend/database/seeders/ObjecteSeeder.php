<?php

namespace Database\Seeders;

use App\Models\Objecte;
use App\Models\User;
use App\Models\Categoria;
use App\Models\Subcategoria;
use App\Models\ImatgeObjecte;
use Illuminate\Database\Seeder;

class ObjecteSeeder extends Seeder
{
    public function run(): void
    {
        // Admin no participa com a usuari corrent: no té objectes als mocks
        $users = User::where('rol', '!=', 'admin')->get();
        $categories = Categoria::all();
        $subcategories = Subcategoria::all();

        if ($users->isEmpty() || $categories->isEmpty() || $subcategories->isEmpty()) {
            $this->command->warn(' Executa UserSeeder, CategoriaSeeder i SubcategoriaSeeder abans.');
            return;
        }

        $objectes = Objecte::factory()
            ->count(30)
            ->sequence(function () use ($users, $categories, $subcategories) {
                $categoria = $categories->random();
                $subcategoria = $subcategories->where('categoria_id', $categoria->id)->random();

                return [
                    'user_id'         => $users->random()->id,
                    'categoria_id'    => $categoria->id,
                    'subcategoria_id' => $subcategoria->id,
                ];
            })
            ->create();

        // ── Generar imatges mock ──
        $imatges = [];
        foreach ($objectes as $objecte) {
            // Entre 1 i 4 imatges per objecte
            $nImatges = rand(1, 4);

            for ($i = 0; $i < $nImatges; $i++) {
                $seed = "{$objecte->id}-{$i}";
                $url  = "https://picsum.photos/seed/{$seed}/800/600";

                $imatges[] = [
                    'objecte_id'           => $objecte->id,
                    'url_cloudinary'       => $url,
                    'public_id_cloudinary' => "mock/{$seed}",
                    'ordre'                => $i,
                    'created_at'           => now(),
                ];
            }
        }

        ImatgeObjecte::insert($imatges);

        $this->command->info(sprintf(
            ' %d objectes creats amb un total de %d imatges mock.',
            $objectes->count(),
            count($imatges)
        ));
    }
}
