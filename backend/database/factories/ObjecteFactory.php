<?php

namespace Database\Factories;

use App\Models\Objecte;
use App\Models\User;
use App\Models\Categoria;
use Illuminate\Database\Eloquent\Factories\Factory;

class ObjecteFactory extends Factory {
    protected $model = Objecte::class;
    public function definition(): array {
        return [
            'user_id' => User::factory(),
            'categoria_id' => Categoria::factory(),
            'nom' => fake()->words(3, true),
            'descripcio' => fake()->paragraph(),
            'preu_per_dia' => fake()->randomFloat(2, 1, 100),
            'imatge_url' => fake()->imageUrl(640, 480, 'objects'),
            'estat' => fake()->randomElement(['disponible',
            'no_disponible']),
        ];
    }

    public function configure(): static {
        return $this->afterCreating(function (Objecte $objecte) {
            $lat = fake()->latitude(41.30, 41.50);
            $lng = fake()->longitude(1.95, 2.25);
            Objecte::setCoordenades($objecte->id, $lat, $lng);
        });
    }

    public function disponible(): static {
        return $this->state(fn () => ['estat' => 'disponible']);
    }
    
    public function noDisponible(): static {
        return $this->state(fn () => ['estat' => 'no_disponible']);
    }
}