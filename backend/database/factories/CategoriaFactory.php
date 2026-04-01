<?php

namespace Database\Factories;

use App\Models\Categoria;
use Illuminate\Database\Eloquent\Factories\Factory;

class CategoriaFactory extends Factory {
    protected $model = Categoria::class;
    public function definition(): array {
        return [
            'nom' => fake()->unique()->word(),
            'icona' => fake()->randomElement(['wrench', 'bike',
            'baby', 'gamepad', 'zap']),
            'descripcio' => fake()->sentence(),
            'activa' => true,
        ];
    }
}