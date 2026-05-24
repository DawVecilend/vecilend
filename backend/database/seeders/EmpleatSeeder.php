<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;

class EmpleatSeeder extends Seeder
{
    public function run(): void
    {
        $now = Carbon::now();

        $empleats = [
            [
                'username' => 'admin',
                'nom'      => 'Admin',
                'cognoms'  => 'Vecilend',
                'email'    => 'admin@vecilend.com',
                'password' => Hash::make('Admin1234!'),
                'rol'      => 'admin',
            ],
            [
                'username' => 'support',
                'nom'      => 'Soporte',
                'cognoms'  => 'Técnico',
                'email'    => 'support@vecilend.com',
                'password' => Hash::make('Support1234!'),
                'rol'      => 'suport',
            ],
        ];

        foreach ($empleats as $e) {
            DB::table('empleats')->insert(array_merge($e, [
                'actiu'      => true,
                'created_at' => $now,
                'updated_at' => $now,
            ]));
        }
    }
}
