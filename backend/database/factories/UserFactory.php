<?php

namespace Database\Factories;

use App\Models\User;
use Database\Seeders\Support\Municipios;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class UserFactory extends Factory
{
    protected $model = User::class;
    protected static ?string $password = null;

    public function definition(): array
    {
        $muni = Municipios::random();
        $lat  = $muni['lat'] + fake()->randomFloat(5, -0.008, 0.008);
        $lng  = $muni['lng'] + fake()->randomFloat(5, -0.008, 0.008);

        return [
            'username' => fake()->unique()->userName(),
            'nom'      => fake()->firstName(),
            'cognoms'  => fake()->lastName() . ' ' . fake()->lastName(),
            'email'    => fake()->unique()->safeEmail(),
            'password' => static::$password ??= Hash::make('User1234!'),
            'biography' => fake()->paragraph(),
            'telefon'   => fake()->phoneNumber(),
            'direccio'  => $muni['name'],
            'avatar_url' => function (array $attributes) {
                $nom = $attributes['nom'] ?? 'User';
                $cognoms = $attributes['cognoms'] ?? '';
                return 'https://ui-avatars.com/api/?name='
                    . urlencode(trim($nom . '+' . $cognoms))
                    . '&background=random&size=128';
            },
            'google_id' => null,
            'ubicacio' => DB::raw(sprintf(
                "ST_SetSRID(ST_MakePoint(%f, %f), 4326)::geography",
                $lng,
                $lat
            )),
            'actiu'  => true,
            'email_verified_at' => now(),
            'remember_token'    => Str::random(10),
        ];
    }


    public function inactiu(): static
    {
        return $this->state(fn() => ['actiu' => false]);
    }

    public function unverified(): static
    {
        return $this->state(fn() => ['email_verified_at' => null]);
    }
}
