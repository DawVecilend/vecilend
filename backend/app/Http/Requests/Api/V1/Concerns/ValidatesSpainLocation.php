<?php

namespace App\Http\Requests\Api\V1\Concerns;

/**
 * Helper compartit per a totes les FormRequests que reben coordenades
 * i exigeixen que el punt sigui dins el territori espanyol.
 *
 * Cobertura:
 *   - Península + Balears: lng [-9.5, 4.5], lat [35.8, 44.0]
 *   - Canàries:            lng [-18.5, -13.3], lat [27.5, 29.5]
 */
trait ValidatesSpainLocation
{
    public static function isInSpain(float $lat, float $lng): bool
    {
        $inPeninsula = $lng >= -9.5 && $lng <= 4.5
                    && $lat >= 35.8 && $lat <= 44.0;
        $inCanarias  = $lng >= -18.5 && $lng <= -13.3
                    && $lat >= 27.5  && $lat <= 29.5;
        return $inPeninsula || $inCanarias;
    }
}
