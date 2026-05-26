<?php

namespace Database\Seeders;

use App\Models\Categoria;
use App\Models\Subcategoria;
use App\Models\User;
use Carbon\Carbon;
use Database\Seeders\Support\Catalogs;
use Database\Seeders\Support\Municipios;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

/**
 * Genera ~1000 objetos repartidos por toda España con una distribución de
 * perfiles realista:
 *   - 30% de usuarios sin objetos
 *   - 50% con 1-3 objetos
 *   - 15% con 4-10 objetos
 *   -  5% "power users" con 11-30 objetos
 */
class ObjecteSeeder extends Seeder
{
    public function run(): void
    {
        $users = User::all();
        $categories = Categoria::with('subcategories')->get();

        if ($users->isEmpty() || $categories->isEmpty()) {
            $this->command->warn('Ejecuta UserSeeder, CategoriaSeeder y SubcategoriaSeeder antes.');
            return;
        }

        // Mapa rápido id_subcategoria => [nom_subcat, nom_categoria]
        $subcatMap = [];
        foreach ($categories as $cat) {
            foreach ($cat->subcategories as $sub) {
                $subcatMap[$sub->id] = ['sub' => $sub->nom, 'cat' => $cat->nom, 'cat_id' => $cat->id];
            }
        }
        $subcatIds = array_keys($subcatMap);

        // Distribución de perfiles
        $userIds = $users->pluck('id')->shuffle()->values()->all();
        $total   = count($userIds);
        $cutSin   = (int) floor($total * 0.30);          // 0..cutSin-1: sin objetos
        $cutBaja  = $cutSin + (int) floor($total * 0.50);// cutSin..cutBaja-1: 1-3
        $cutMedia = $cutBaja + (int) floor($total * 0.15);// cutBaja..cutMedia-1: 4-10
        // cutMedia..total-1: 11-30 (power users)

        $now = Carbon::now();
        $batch = [];
        $imatges = [];
        $created = 0;

        foreach ($userIds as $idx => $uid) {
            if ($idx < $cutSin) {
                $n = 0;
            } elseif ($idx < $cutBaja) {
                $n = mt_rand(1, 3);
            } elseif ($idx < $cutMedia) {
                $n = mt_rand(4, 10);
            } else {
                $n = mt_rand(11, 30);
            }

            for ($k = 0; $k < $n; $k++) {
                $subId   = $subcatIds[array_rand($subcatIds)];
                $subInfo = $subcatMap[$subId];
                $nom     = Catalogs::nameFor($subInfo['cat'], $subInfo['sub']);
                $tipus   = mt_rand(1, 100) <= 10 ? 'prestec' : 'lloguer';
                $muni    = Municipios::random();
                $lat     = $muni['lat'] + (mt_rand(-600, 600) / 100000);
                $lng     = $muni['lng'] + (mt_rand(-600, 600) / 100000);
                $createdAt = $now->copy()->subDays(mt_rand(1, 120))->subHours(mt_rand(0, 23));

                $row = [
                    'user_id'         => $uid,
                    'categoria_id'    => $subInfo['cat_id'],
                    'subcategoria_id' => $subId,
                    'nom'             => $nom,
                    'slug'            => Str::slug($nom) . '-' . substr(md5($uid . '-' . $idx . '-' . $k), 0, 6),
                    'descripcio'      => Catalogs::descripcio($tipus),
                    'tipus'           => $tipus,
                    'preu_diari'      => $tipus === 'lloguer' ? mt_rand(100, 9999) / 100 : null,
                    'estat'           => mt_rand(1, 100) <= 90 ? 'disponible' : 'no_disponible',
                    'ubicacio'        => DB::raw("ST_SetSRID(ST_MakePoint({$lng}, {$lat}), 4326)::geography"),
                    'created_at'      => $createdAt,
                    'updated_at'      => $createdAt,
                ];

                // No podemos insert masivo con DB::raw: insertamos uno a uno
                // (sigue siendo aceptable porque solo son ~1000 filas y se
                // ejecuta una sola vez en migrate:fresh --seed).
                $objId = DB::table('objectes')->insertGetId($row);
                $created++;

                // Imágenes: 1-4 con seed consistente por objeto (todas las
                // fotos del mismo objeto comparten estilo aunque no sean del
                // objeto exacto descrito).
                $nImg = mt_rand(1, 4);
                $seedBase = 'vlend-' . $objId;
                for ($i = 0; $i < $nImg; $i++) {
                    $imatges[] = [
                        'objecte_id'           => $objId,
                        'url_cloudinary'       => "https://picsum.photos/seed/{$seedBase}-{$i}/800/600",
                        'public_id_cloudinary' => "mock/{$seedBase}-{$i}",
                        'ordre'                => $i,
                        'created_at'           => $createdAt,
                    ];
                }

                if (count($imatges) >= 200) {
                    DB::table('imatges_objecte')->insert($imatges);
                    $imatges = [];
                }
            }
        }

        if (!empty($imatges)) {
            DB::table('imatges_objecte')->insert($imatges);
        }

        $this->command->info("✓ {$created} objetos creados con imágenes mock.");
    }
}
