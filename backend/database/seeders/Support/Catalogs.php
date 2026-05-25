<?php

namespace Database\Seeders\Support;

/**
 * Catálogos curados para que los seeders generen objetos, valoraciones
 * y chats con apariencia realista (sin texto Lorem Ipsum aleatorio).
 *
 * Las claves de NAMES y DESCRIPTIONS son "Categoría||Subcategoría".
 */
class Catalogs
{
    public const NAMES = [
        'Viajes||Maletas' => ['Maleta rígida 65L', 'Maleta cabina 4 ruedas', 'Maleta blanda Samsonite 70L', 'Maleta vintage cuero', 'Trolley 50cm cabina', 'Maleta XL rígida American Tourister', 'Set maletas 3 piezas', 'Maleta Delsey Cabin Plus'],
        'Viajes||Mochilas' => ['Mochila trekking 50L Deuter', 'Mochila día 25L Quechua', 'Mochila viaje 40L cabina', 'Mochila ultraligera 18L', 'Mochila técnica Osprey 45L', 'Mochila escolar Eastpak', 'Mochila portaequipajes', 'Mochila North Face Borealis'],
        'Viajes||Accesorios de viaje' => ['Adaptador universal de enchufes', 'Báscula de maletas digital', 'Almohada cervical de viaje', 'Funda maleta antirrobo', 'Cinturón portamonedas', 'Organizadores maleta packing cubes', 'Neceser colgante de viaje'],
        'Construcción||Maquinaria' => ['Hormigonera 130L', 'Cortadora cerámica 750mm', 'Martillo demoledor SDS-Max', 'Compresor aire 50L', 'Andamio aluminio 4m', 'Generador gasolina 3kW', 'Vibrador de hormigón', 'Rozadora de pared 125mm'],
        'Construcción||Seguridad' => ['Casco de obra blanco', 'Arnés anticaídas 5 puntos', 'Gafas de seguridad ESAB', 'Guantes anticorte talla L', 'Botas seguridad S3 talla 42', 'Mascarilla FFP3 reutilizable', 'Protector auditivo 3M'],
        'Construcción||Material de obra' => ['Caballetes plegables (par)', 'Reglón aluminio 2m', 'Cubo albañil 25L', 'Llana de acero inox', 'Saco escombros big bag', 'Carretilla 80L', 'Pala de punta forjada'],
        'Herramientas||Manuales' => ['Juego destornilladores aislados 9 piezas', 'Llave inglesa 12"', 'Sierra de mano universal', 'Maletín herramientas 100 piezas', 'Alicate universal 200mm', 'Martillo 500g carpintero', 'Set llaves Allen métricas'],
        'Herramientas||Eléctricas' => ['Taladro percutor Bosch GSB 18V', 'Sierra circular Makita 165mm', 'Atornillador batería Dewalt', 'Amoladora 125mm 900W', 'Lijadora orbital Bosch', 'Multiherramienta Fein', 'Soldador inverter 160A'],
        'Herramientas||Medición' => ['Nivel láser autonivelante Bosch', 'Distanciómetro Leica Disto', 'Telémetro láser 50m', 'Cinta métrica 8m', 'Calibre digital 150mm', 'Detector de cables y metales', 'Multímetro digital Fluke'],
        'Jardinería||Poda' => ['Tijera podar Felco', 'Cortasetos eléctrico 600W', 'Motosierra eléctrica 40cm', 'Sierra telescópica de jardín', 'Cortacésped eléctrico 1600W', 'Tijera podar telescópica'],
        'Jardinería||Riego' => ['Manguera 25m con carro', 'Aspersor programable 360°', 'Programador de riego 4 zonas', 'Pistola riego multifunción', 'Kit riego por goteo 50m'],
        'Jardinería||Plantación' => ['Carretilla jardín 100L', 'Pala azada de acero', 'Saca-tierras manual', 'Set plantadores de bulbos', 'Rastrillo de hojas regulable', 'Motoazada eléctrica 1400W'],
        'Electrodomésticos||Cocina' => ['Robot cocina Thermomix', 'Freidora de aire Cosori 5L', 'Batidora de vaso Vitamix', 'Plancha cocina eléctrica', 'Cafetera espresso DeLonghi', 'Máquina de helados Cuisinart', 'Olla a presión eléctrica 6L'],
        'Electrodomésticos||Limpieza' => ['Aspirador vertical Dyson V11', 'Hidrolimpiadora Kärcher K5', 'Mopa de vapor Polti', 'Robot aspirador Roomba i7', 'Aspirador de taller 30L', 'Limpiadora de moqueta y tapicería'],
        'Electrodomésticos||Climatización' => ['Aire portátil 12000 BTU', 'Ventilador de torre silencioso', 'Calefactor cerámico Orbegozo', 'Deshumidificador 20L/día', 'Humidificador ultrasónico', 'Estufa de pellets compacta'],
        'Movilidad||Bicicletas' => ['Bici eléctrica urbana 250W', 'Bici de montaña Trek 29"', 'Bici plegable Brompton M6L', 'Bici carretera Specialized', 'Bici infantil 20"', 'Bici cargo familiar', 'Bici híbrida Decathlon Riverside'],
        'Movilidad||Patinetes' => ['Patinete eléctrico Xiaomi M365', 'Patinete adulto plegable', 'Patinete eléctrico 25km autonomía', 'Patinete freestyle de aluminio', 'Patinete eléctrico todoterreno'],
        'Movilidad||Accesorios' => ['Casco bici adulto talla M', 'Portabicis trasero para coche', 'Candado U Abus', 'Remolque infantil 2 plazas', 'Sillita bici trasera para niños', 'Bolsas alforjas para bicicleta'],
        'Fitness||Pesas' => ['Set mancuernas hexagonales 5-25kg', 'Pesa rusa kettlebell 16kg', 'Barra olímpica 220cm + discos', 'Mancuernas ajustables Bowflex', 'Soporte vertical para mancuernas'],
        'Fitness||Cardio' => ['Cinta de correr plegable Domyos', 'Bici estática de spinning', 'Elíptica plegable', 'Remo magnético tipo Concept2', 'Banco de abdominales regulable', 'Caminadora curva'],
        'Fitness||Yoga' => ['Esterilla yoga 6mm', 'Bloque yoga corcho (par)', 'Pelota pilates 65cm', 'Rueda yoga 33cm', 'Cinta yoga + bolsa de transporte', 'Set 5 bandas elásticas'],
        'Surf||Tablas' => ['Tabla surf 6\'2 fish', 'Longboard 9\'0 noser', 'Tabla SUP hinchable 10\'6', 'Bodyboard 42"', 'Tabla iniciación softboard 7\'0', 'Foil surf intermedio'],
        'Surf||Neoprenos' => ['Neopreno 4/3mm talla M', 'Neopreno 3/2 talla L verano', 'Escarpines neopreno 3mm', 'Capucha de neopreno surf', 'Lycra UV manga larga'],
        'Surf||Accesorios' => ['Funda tabla 6\'4 acolchada', 'Invento de tabla de surf', 'Quillas FCS II tri set', 'Leash 7\' surf', 'Wax pack 4 unidades', 'Tail pad surf'],
        'Bebés y niños||Tronas' => ['Trona Stokke Tripp Trapp', 'Trona evolutiva Chicco', 'Trona de viaje plegable', 'Asiento elevador comedor', 'Trona Inglesina Fast'],
        'Bebés y niños||Cochecitos' => ['Cochecito Bugaboo Fox', 'Silla paseo ligera Cybex', 'Carrito gemelar Babyzen Yoyo', 'Capazo recién nacido', 'Cochecito 3 ruedas todoterreno'],
        'Bebés y niños||Seguridad infantil' => ['Silla coche grupo 0+ Maxi-Cosi', 'Silla coche grupo 2/3 Britax', 'Barrera escalera 75-95cm', 'Cuna de viaje plegable', 'Vigilabebés vídeo Babymoov'],
        'Juegos de mesa||Estrategia' => ['Catan: Colonos de Catán', 'Carcassonne base', 'Risk versión clásica', 'Aventureros al Tren: Europa', 'Twilight Imperium 4ª ed', 'Terraforming Mars'],
        'Juegos de mesa||Cooperativos' => ['Pandemic Legacy temporada 1', 'Mansiones de la Locura', 'Eldritch Horror', 'Spirit Island', 'Forbidden Island', 'Cthulhu: Death May Die'],
        'Juegos de mesa||Familiares' => ['Dixit + expansión', 'Codenames Duo', 'Hanabi', 'Ticket to Ride First Journey', 'Azul edición clásica', 'Sushi Go Party'],
    ];

    public const DESCRIPCIONS_PRESTEC = [
        'Lo presto a quien lo necesite, en perfecto estado. Trato cuidadoso y devolverlo limpio, por favor.',
        'Lo uso poco, así que prefiero compartirlo. Recogida y devolución acordadas por chat.',
        'Está prácticamente nuevo. Ideal si lo necesitas puntualmente y no quieres comprar uno.',
        'Lo tengo guardado y prefiero que se use. Solo te pido cuidarlo como si fuera tuyo.',
        'Préstamo entre vecinos, sin compromiso. Concretamos por mensaje fecha de recogida.',
    ];

    public const DESCRIPCIONS_LLOGUER = [
        'En perfecto estado de uso, revisado entre alquileres. Precio por día incluye accesorios básicos.',
        'Equipo de gama media-alta, usado con cuidado. Acepto fianzas por chat si lo necesitas para varios días.',
        'Lo alquilo cuando no lo uso. Está en perfecto estado y listo para usar.',
        'Disponible para alquiler por días. Recogida en mi domicilio o punto acordado.',
        'Lo mantengo como nuevo. Si lo necesitas más de una semana, hablamos por chat para ajustar precio.',
        'Comprado hace poco, lo uso pocas veces al año. Mejor que te lo quedes los días que lo necesites.',
    ];

    public const VALORACIONS_5 = [
        'Todo perfecto, repetiré sin duda.',
        'Muy buen trato y el objeto estaba como en las fotos.',
        'Súper recomendable, muy atento con la coordinación.',
        'Cumplió a la perfección. ¡Gracias!',
        'Buena comunicación y puntualidad en la entrega.',
        'Excelente experiencia, el material en perfecto estado.',
    ];

    public const VALORACIONS_4 = [
        'Todo bien en general, pequeños detalles a mejorar pero nada importante.',
        'Buena experiencia, recomendable.',
        'Cumplió con lo acordado, sin incidencias.',
        'Bien, todo según lo descrito.',
        'Sin problemas. Volvería a tratar.',
    ];

    public const VALORACIONS_3 = [
        'Un poco de retraso en la entrega, pero el objeto bien.',
        'Algunos detalles a mejorar, pero en conjunto está bien.',
        'Cumplió aunque la comunicación fue lenta al principio.',
        'Está bien, pero no era exactamente como esperaba.',
    ];

    public const CHAT_TEMPLATES = [
        '¡Hola! He visto tu objeto, ¿sigue disponible?',
        'Buenas, ¿podríamos quedar mañana por la tarde?',
        'Perfecto, te lo confirmo en un rato.',
        'Sí, claro, sin problema.',
        '¿En qué horario te va mejor?',
        'Te lo agradezco mucho 🙌',
        'Genial, nos vemos entonces.',
        '¿Lo necesitas con algún accesorio extra?',
        'Te paso mi ubicación más tarde.',
        'Muchas gracias, ya te aviso cuando llegue.',
        'Ok, perfecto.',
        'Al final me surge un imprevisto, ¿podemos cambiar la hora?',
        'No te preocupes, lo dejamos para otro día.',
        '¿Cuántos días lo necesitas?',
        'Gracias por la rápida respuesta.',
        '¿Está en perfecto estado? ¿Algún detalle que deba saber?',
        'Sí, está como en las fotos. Cualquier duda me dices.',
        '¿Aceptarías una pequeña fianza por privado?',
        'No hace falta fianza, suficiente con un buen trato.',
        '¿El precio es negociable si lo cojo varios días?',
        'Si lo coges más de 5 días te puedo hacer descuento.',
        'Vale, mañana sobre las 18h en la plaza, ¿te va bien?',
        'Me viene perfecto, allí estaré.',
        'Te lo dejo en la portería entonces.',
        'Acabo de llegar, ¿bajas?',
        'Bajo en 2 minutos.',
        'Ya está, todo correcto. Mil gracias!',
        'Gracias a ti, cualquier cosa me avisas.',
        '¿Te importa si lo devuelvo un día más tarde?',
        'Sin problema, dime cuándo te va bien.',
    ];

    public static function nameFor(string $categoria, string $subcategoria): string
    {
        $key  = $categoria . '||' . $subcategoria;
        $list = self::NAMES[$key] ?? [$subcategoria];
        return $list[array_rand($list)];
    }

    public static function descripcio(string $tipus): string
    {
        $pool = $tipus === 'prestec' ? self::DESCRIPCIONS_PRESTEC : self::DESCRIPCIONS_LLOGUER;
        return $pool[array_rand($pool)];
    }

    public static function valoracioComment(int $puntuacio): string
    {
        if ($puntuacio >= 5) $pool = self::VALORACIONS_5;
        elseif ($puntuacio >= 4) $pool = self::VALORACIONS_4;
        else $pool = self::VALORACIONS_3;
        return $pool[array_rand($pool)];
    }

    public static function chatMessage(): string
    {
        return self::CHAT_TEMPLATES[array_rand(self::CHAT_TEMPLATES)];
    }
}
