<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class SubcategoriaSeeder extends Seeder {
    public function run(): void {
        $now = Carbon::now();
        $map = [
            'Eines' => ['Eines elèctriques','Eines manuals','Pintura i decoració','Fontaneria','Fusteria'],
            'Electrònica' => ['Ordinadors i tauletes','Perifèrics','Domòtica','Components'],
            'Esports' => ['Esports aquàtics','Fitness','Esports de pilota','Esquí i neu','Ciclisme'],
            'Llar i Jardí' => ['Electrodomèstics','Mobiliari','Eines de jardí','Neteja'],
            'Vehicles i Mobilitat' => ['Bicicletes','Patinets elèctrics','Accessoris','Remolcs'],
            'Fotografia i Vídeo' => ['Càmeres','Objectius','Il·luminació','Drons','Trípodes i estabilitzadors'],
            'Música' => ['Corda','Vent','Percussió','Teclats i pianos','Equip de so'],
            'Camping i Natura' => ['Tendes i refugis','Sacs de dormir','Cuina de camp','Orientació i GPS'],
            'Jocs i Entreteniment' => ['Jocs de taula','Consoles','Realitat virtual','Jocs de festa'],
            'Roba i Accessoris' => ['Disfresses','Vestits de cerimònia','Complements'],
            'Bebès i Infants' => ['Cotxets','Cadires de cotxe','Joguines','Mobiliari infantil'],
            'Altres' => []
        ];

        foreach ($map as $catNom => $subcats) {
            $catId = DB::table('categories')->where('nom', $catNom)->value('id');
            if (! $catId) {
                continue;
            }

            foreach ($subcats as $subNom) {
                DB::table('subcategories')->insert([
                    'categoria_id' => $catId,
                    'nom' => $subNom,
                    'activa' => true,
                    'created_at' => $now,
                    'updated_at' => $now
                ]);
            }
        }
    }
}