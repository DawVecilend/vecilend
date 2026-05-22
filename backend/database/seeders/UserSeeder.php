<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $now = Carbon::now();

        $usuaris = [
            ['username' => 'maria', 'nom' => 'Maria', 'cognoms' => 'García López', 'genere' => 'dona', 'email' => 'maria@example.com', 'lng' => 2.17744, 'lat' => 41.38229, 'biography' => 'Usuaria de prueba.', 'telefon' => '666666667', 'direccio' => 'Barcelona'],
            ['username' => 'pere', 'nom' => 'Pere', 'cognoms' => 'Martínez Soler', 'genere' => 'home', 'email' => 'pere@example.com', 'lng' => 1.998511, 'lat' => 41.304085, 'biography' => 'Usuario de prueba.', 'telefon' => '666666668', 'direccio' => 'Gavá'],
            ['username' => 'laura', 'nom' => 'Laura', 'cognoms' => 'Fernández Roca', 'genere' => 'dona', 'email' => 'laura@example.com', 'lng' => 2.019943, 'lat' => 41.316051, 'biography' => 'Usuaria de prueba.', 'telefon' => '666666669', 'direccio' => 'Viladecans'],
            ['username' => 'joan', 'nom' => 'Joan', 'cognoms' => 'Puig Vidal', 'genere' => 'home', 'email' => 'joan@example.com', 'lng' => 1.976691, 'lat' => 41.280106, 'biography' => 'Usuario de prueba.', 'telefon' => '666666670', 'direccio' => 'Castelldefels'],
        ];

        foreach ($usuaris as $u) {
            DB::table('users')->insert([
                'username' => $u['username'],
                'nom' => $u['nom'],
                'cognoms' => $u['cognoms'],
                'email' => $u['email'],
                'password' => Hash::make('User1234!'),
                'biography' => $u['biography'],
                'telefon' => $u['telefon'],
                'direccio' => $u['direccio'],
                'avatar_url' => 'https://ui-avatars.com/api/?name=' . urlencode($u['nom'] . '+' . $u['cognoms']) . '&background=random&size=128',
                'ubicacio' => DB::raw("ST_SetSRID(ST_MakePoint({$u['lng']}, {$u['lat']}), 4326)::geography"),
                'actiu' => true,
                'email_verified_at' => $now,
                'created_at' => $now,
                'updated_at' => $now
            ]);
        }
    }
}
