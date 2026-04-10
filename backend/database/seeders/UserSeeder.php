<?php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;

class UserSeeder extends Seeder {
    public function run(): void {
        $now = Carbon::now();
        DB::table('users')->insert([
            'username' => 'admin',
            'nom' => 'Admin',
            'cognoms' => 'Vecilend',
            'email' => 'admin@vecilend.com',
            'password' => Hash::make('Admin1234!'),
            'ubicacio' => DB::raw("ST_SetSRID(ST_MakePoint(2.0872,
            41.3831), 4326)"), // Esplugues aprox.
            'radi_proximitat' => 10,
            'rol' => 'admin',
            'actiu' => true,
            'email_verified_at' => $now,
            'created_at' => $now,
            'updated_at' => $now
        ]);

        $usuaris = [
            ['username' => 'maria','nom' => 'Maria','cognoms' => 'Garcia López','email' => 'maria@example.com','lng' => 2.0950, 'lat' => 41.3850,'radi' => 5],
            ['username' => 'pere','nom' => 'Pere','cognoms' => 'Martínez Soler','email' => 'pere@example.com','lng' => 2.0780, 'lat' => 41.3790,'radi' => 3],
            ['username' => 'laura','nom' => 'Laura','cognoms' => 'Fernández Roca','email' => 'laura@example.com','lng' => 2.1000, 'lat' => 41.3900,'radi' => 8],
            ['username' => 'joan','nom' => 'Joan','cognoms' => 'Puig Vidal','email' => 'joan@example.com','lng' => 2.0830, 'lat' => 41.3770,'radi' => 5],
        ];

        foreach ($usuaris as $u) {
            DB::table('users')->insert([
                'username' => $u['username'],
                'nom' => $u['nom'],
                'cognoms' => $u['cognoms'],
                'email' => $u['email'],
                'password' => Hash::make('User1234!'),
                'ubicacio' => DB::raw("ST_SetSRID(ST_MakePoint({$u['lng']}, {$u['lat']}), 4326)"),
                'radi_proximitat' => $u['radi'],
                'rol' => 'usuari',
                'actiu' => true,
                'email_verified_at' => $now,
                'created_at' => $now,
                'updated_at' => $now
            ]);
        }
    }
}