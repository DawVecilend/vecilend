<?php

namespace Database\Factories;

use App\Models\Objecte;
use App\Models\User;
use App\Models\Categoria;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\DB;

class ObjecteFactory extends Factory
{
    protected $model = Objecte::class;

    public function definition(): array
    {
        $lat = fake()->latitude(41.30, 41.50);
        $lng = fake()->longitude(1.95, 2.25);

        return [
            'user_id'      => User::factory(),
            'categoria_id' => Categoria::factory(),
            'nom'          => fake()->words(3, true),
            'descripcio'   => fake()->paragraph(),
            'tipus'        => fake()->randomElement(['prestec', 'lloguer', 'ambdos']),
            'preu_diari'   => fake()->randomFloat(2, 1, 100),
            'estat'        => fake()->randomElement(['disponible', 'no_disponible']),
            'ubicacio'     => DB::raw("ST_SetSRID(ST_MakePoint({$lng}, {$lat}), 4326)::geography"),
            'created_at'   => fake()->dateTimeBetween('-90 days', 'now'),
            'updated_at'   => fn(array $attrs) => fake()->dateTimeBetween($attrs['created_at'], 'now'),
        ];
    }

    public function disponible(): static
    {
        return $this->state(fn() => ['estat' => 'disponible']);
    }

    public function noDisponible(): static
    {
        return $this->state(fn() => ['estat' => 'no_disponible']);
    }
}
