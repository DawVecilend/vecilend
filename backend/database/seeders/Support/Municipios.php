<?php

namespace Database\Seeders\Support;

/**
 * Helper para acceder al catálogo de municipios españoles
 * (database/data/municipios.json). Mantiene los datos en memoria
 * estática para no leer el JSON repetidamente durante el seeding.
 */
class Municipios
{
    private static ?array $all = null;

    public static function all(): array
    {
        if (self::$all === null) {
            $path = database_path('data/municipios.json');
            self::$all = file_exists($path)
                ? json_decode(file_get_contents($path), true)
                : [];
        }
        return self::$all;
    }

    public static function random(): array
    {
        $all = self::all();
        return $all[array_rand($all)];
    }
}
