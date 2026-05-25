<?php

namespace Database\Seeders;

use Carbon\Carbon;
use Database\Seeders\Support\Municipios;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

/**
 * Crea 4 usuarios fijos (para login de prueba) + 296 usuarios sintéticos
 * con ubicaciones repartidas por España (basadas en municipios reales).
 */
class UserSeeder extends Seeder
{
    public function run(): void
    {
        $now = Carbon::now();

        // 4 usuarios fijos con credenciales conocidas
        $usuarisFixes = [
            ['username' => 'maria', 'nom' => 'Maria', 'cognoms' => 'García López', 'email' => 'maria@example.com', 'lng' => 2.17744, 'lat' => 41.38229, 'biography' => 'Usuaria de prueba.', 'telefon' => '666666667', 'direccio' => 'Barcelona'],
            ['username' => 'pere',  'nom' => 'Pere',  'cognoms' => 'Martínez Soler', 'email' => 'pere@example.com',  'lng' => 1.998511, 'lat' => 41.304085, 'biography' => 'Usuario de prueba.', 'telefon' => '666666668', 'direccio' => 'Gavá'],
            ['username' => 'laura', 'nom' => 'Laura', 'cognoms' => 'Fernández Roca', 'email' => 'laura@example.com', 'lng' => 2.019943, 'lat' => 41.316051, 'biography' => 'Usuaria de prueba.', 'telefon' => '666666669', 'direccio' => 'Viladecans'],
            ['username' => 'joan',  'nom' => 'Joan',  'cognoms' => 'Puig Vidal',     'email' => 'joan@example.com',  'lng' => 1.976691, 'lat' => 41.280106, 'biography' => 'Usuario de prueba.', 'telefon' => '666666670', 'direccio' => 'Castelldefels'],
        ];

        foreach ($usuarisFixes as $u) {
            DB::table('users')->insert([
                'username'   => $u['username'],
                'nom'        => $u['nom'],
                'cognoms'    => $u['cognoms'],
                'email'      => $u['email'],
                'password'   => Hash::make('User1234!'),
                'biography'  => $u['biography'],
                'telefon'    => $u['telefon'],
                'direccio'   => $u['direccio'],
                'avatar_url' => 'https://ui-avatars.com/api/?name=' . urlencode($u['nom'] . '+' . $u['cognoms']) . '&background=random&size=128',
                'ubicacio'   => DB::raw("ST_SetSRID(ST_MakePoint({$u['lng']}, {$u['lat']}), 4326)::geography"),
                'actiu'      => true,
                'email_verified_at' => $now,
                'created_at' => $now,
                'updated_at' => $now,
            ]);
        }

        // 296 usuarios sintéticos para llegar a ~300
        $faker  = \Faker\Factory::create('es_ES');
        $faker->seed(2026);
        $batch  = [];
        $target = 296;

        for ($i = 0; $i < $target; $i++) {
            $nom     = $faker->firstName();
            $cognoms = $faker->lastName() . ' ' . $faker->lastName();
            $muni    = Municipios::random();
            $lat     = $muni['lat'] + (mt_rand(-800, 800) / 100000);
            $lng     = $muni['lng'] + (mt_rand(-800, 800) / 100000);

            // direccio debe ser un municipio válido (regla del UpdateProfileRequest)
            $username = Str::slug($nom . '.' . $cognoms . '.' . $i, '.');

            $batch[] = [
                'username'   => $username,
                'nom'        => $nom,
                'cognoms'    => $cognoms,
                'email'      => 'user' . $i . '@example.com',
                'password'   => Hash::make('User1234!'),
                'biography'  => $faker->sentence(8),
                'telefon'    => '6' . str_pad((string)mt_rand(0, 99999999), 8, '0', STR_PAD_LEFT),
                'direccio'   => $muni['name'],
                'avatar_url' => 'https://ui-avatars.com/api/?name=' . urlencode($nom . '+' . $cognoms) . '&background=random&size=128',
                'ubicacio'   => DB::raw("ST_SetSRID(ST_MakePoint({$lng}, {$lat}), 4326)::geography"),
                'actiu'      => true,
                'email_verified_at' => $now,
                'remember_token'    => Str::random(10),
                'created_at' => $now,
                'updated_at' => $now,
            ];

            // Insertamos cada 50 filas para no saturar memoria y porque
            // DB::raw no se puede usar en un insert masivo de >n filas con bindings.
            if (count($batch) === 50) {
                foreach ($batch as $row) {
                    DB::table('users')->insert($row);
                }
                $batch = [];
            }
        }
        foreach ($batch as $row) {
            DB::table('users')->insert($row);
        }

        $this->command->info('✓ ' . (4 + $target) . ' usuarios creados (4 fijos + ' . $target . ' sintéticos).');
    }
}
