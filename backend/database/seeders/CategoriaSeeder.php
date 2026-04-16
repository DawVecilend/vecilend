<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class CategoriaSeeder extends Seeder {
    public function run(): void {
        $now = Carbon::now();
        $categories = [
            ['nom' => 'Eines', 'icona' => 'wrench', 'descripcio' => 'Eines manuals i elèctriques per a bricolatge i reparacions'],
            ['nom' => 'Electrònica', 'icona' => 'cpu', 'descripcio' => 'Dispositius electrònics, gadgets i accessoris'],
            ['nom' => 'Esports', 'icona' => 'dumbbell', 'descripcio' => 'Material esportiu i equipament per a activitats físiques'],
            ['nom' => 'Llar i Jardí', 'icona' => 'home', 'descripcio' => 'Mobiliari, decoració, electrodomèstics i eines de jardí'],
            ['nom' => 'Vehicles i Mobilitat', 'icona' => 'bike', 'descripcio' => 'Bicicletes, patinets, remolcs i accessoris de mobilitat'],
            ['nom' => 'Fotografia i Vídeo', 'icona' => 'camera', 'descripcio' => 'Càmeres, objectius, trípodes i equipament audiovisual'],
            ['nom' => 'Música', 'icona' => 'music', 'descripcio' => 'Instruments musicals i equipament de so'],
            ['nom' => 'Camping i Natura', 'icona' => 'tent', 'descripcio' => 'Tendes, sacs de dormir, motxilles i material de muntanya'],
            ['nom' => 'Jocs i Entreteniment','icona' => 'gamepad', 'descripcio' => 'Jocs de taula, consoles, jocs de festa i entreteniment'],
            ['nom' => 'Roba i Accessoris', 'icona' => 'shirt', 'descripcio' => 'Roba de disfressa, vestits de cerimònia i accessoris especials'],
            ['nom' => 'Bebès i Infants', 'icona' => 'baby', 'descripcio' => 'Cotxets, cadires, joguines i material infantil'],
            ['nom' => 'Altres', 'icona' => 'package', 'descripcio' => 'Objectes que no encaixen en cap altra categoria']
        ];

        foreach ($categories as $cat) {
            DB::table('categories')->insert(array_merge($cat, [
                'activa' => true,
                'created_at' => $now,
                'updated_at' => $now
            ]));
        }
    }
}