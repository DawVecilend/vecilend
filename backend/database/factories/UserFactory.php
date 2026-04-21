<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;

class UserFactory extends Factory
{
    protected $model = User::class;
    protected static ?string $password = null;
    public function definition(): array
    {
        return [
            'username' => fake()->unique()->userName(),
            'nom' => fake()->firstName(),
            'cognoms' => fake()->lastName() . ' ' . fake()->lastName(),
            'email' => fake()->unique()->safeEmail(),
            'password' => static::$password ??= Hash::make('User1234!'),
            'biography' => fake()->paragraph(),
            'telefon' => fake()->phoneNumber(),
            'direccio' => fake()->city(),
            'ubicacio' => null,
            'avatar_url' => null,
            'google_id' => null,
            'ubicacio' => DB::raw(sprintf(
                "ST_SetSRID(ST_MakePoint(%f, %f), 4326)::geography",
                fake()->longitude(1.95, 2.25),
                fake()->latitude(41.30, 41.50)
            )),
            'radi_proximitat' => fake()->numberBetween(1, 15),
            'rol' => 'usuari',
            'actiu' => true,
            'email_verified_at' => now(),
            'remember_token' => Str::random(10),
        ];
    }

    public function admin(): static
    {
        return $this->state(fn() => ['rol' => 'admin']);
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
