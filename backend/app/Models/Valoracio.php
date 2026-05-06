<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\DB;

class Valoracio extends Model
{
    use HasFactory;

    protected $table = 'valoracions';

    public $timestamps = false; // només tenim created_at

    protected $fillable = [
        'transaccio_id',
        'autor_id',
        'valorat_id',
        'objecte_id',
        'puntuacio',
        'comentari',
        'created_at',
    ];

    protected $casts = [
        'puntuacio'  => 'integer',
        'created_at' => 'datetime',
    ];

    /** Semivida del decaïment exponencial, en dies. */
    public const HALF_LIFE_DAYS = 30;

    // ── Relacions ──

    public function transaccio(): BelongsTo
    {
        return $this->belongsTo(Transaccio::class, 'transaccio_id');
    }

    public function autor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'autor_id');
    }

    public function valorat(): BelongsTo
    {
        return $this->belongsTo(User::class, 'valorat_id');
    }

    public function objecte(): BelongsTo
    {
        return $this->belongsTo(Objecte::class, 'objecte_id');
    }

    // ──────────────────────────────────────────────────────────────
    //  Stats: mitjana ponderada per temps + total
    // ──────────────────────────────────────────────────────────────

    /**
     * Stats d'un usuari en un rol concret.
     *
     * @param  string $rol  'propietari' | 'solicitant' | 'qualsevol'
     * @return array{avg: float|null, total: int}
     */
    public static function statsUsuari(int $userId, string $rol = 'qualsevol'): array
    {
        $query = self::query()->where('valorat_id', $userId);

        if ($rol === 'propietari') {
            // L'usuari valorat és el propietari de l'objecte de la transacció
            $query->whereExists(function ($q) {
                $q->select(DB::raw(1))
                    ->from('objectes')
                    ->whereColumn('objectes.id', 'valoracions.objecte_id')
                    ->whereColumn('objectes.user_id', 'valoracions.valorat_id');
            });
        } elseif ($rol === 'solicitant') {
            // L'usuari valorat NO és el propietari → és el sol·licitant
            $query->whereExists(function ($q) {
                $q->select(DB::raw(1))
                    ->from('objectes')
                    ->whereColumn('objectes.id', 'valoracions.objecte_id')
                    ->whereColumn('objectes.user_id', '!=', 'valoracions.valorat_id');
            });
        }

        $rows = $query->orderBy('created_at')->get(['puntuacio', 'created_at']);

        return self::calcularStats($rows);
    }

    /**
     * Stats del propietari per un objecte concret (per a la tarjeta i el detall).
     */
    public static function statsPropietariPerObjecte(int $objecteId): array
    {
        $rows = self::query()
            ->where('objecte_id', $objecteId)
            ->whereExists(function ($q) {
                $q->select(DB::raw(1))
                    ->from('objectes')
                    ->whereColumn('objectes.id', 'valoracions.objecte_id')
                    ->whereColumn('objectes.user_id', 'valoracions.valorat_id');
            })
            ->orderBy('created_at')
            ->get(['puntuacio', 'created_at']);

        return self::calcularStats($rows);
    }

    /**
     * Versió bulk per a llistats. Calcula stats del propietari per cada objecte.
     *
     * @param  int[] $objecteIds
     * @return array<int, array{avg: float|null, total: int}>
     */
    public static function statsPropietariPerObjectesBulk(array $objecteIds): array
    {
        if (empty($objecteIds)) {
            return [];
        }

        $rows = self::query()
            ->whereIn('valoracions.objecte_id', $objecteIds)
            ->join('objectes', function ($join) {
                $join->on('objectes.id', '=', 'valoracions.objecte_id')
                    ->on('objectes.user_id', '=', 'valoracions.valorat_id');
            })
            ->select('valoracions.objecte_id', 'valoracions.puntuacio', 'valoracions.created_at')
            ->orderBy('valoracions.created_at')
            ->get();

        $grouped = $rows->groupBy('objecte_id');

        $result = [];
        foreach ($objecteIds as $id) {
            $result[$id] = self::calcularStats($grouped->get($id) ?? collect());
        }
        return $result;
    }

    /**
     * Càlcul de la mitjana ponderada per temps en PHP.
     */
    private static function calcularStats(\Illuminate\Support\Collection $rows): array
    {
        if ($rows->isEmpty()) {
            return ['avg' => null, 'total' => 0];
        }

        $now           = now();
        $totalWeight   = 0.0;
        $weightedSum   = 0.0;
        $halfLifeSec   = self::HALF_LIFE_DAYS * 86400;

        foreach ($rows as $row) {
            $createdAt = $row->created_at instanceof \DateTimeInterface
                ? $row->created_at
                : \Carbon\Carbon::parse($row->created_at);

            $ageSec = max(0, $now->getTimestamp() - $createdAt->getTimestamp());
            $weight = pow(0.5, $ageSec / $halfLifeSec);

            $weightedSum += ((int) $row->puntuacio) * $weight;
            $totalWeight += $weight;
        }

        return [
            'avg'   => $totalWeight > 0 ? round($weightedSum / $totalWeight, 1) : null,
            'total' => $rows->count(),
        ];
    }

    // ──────────────────────────────────────────────────────────────
    //  Subquery SQL per al sort=rating (objectes per mitjana del propietari)
    // ──────────────────────────────────────────────────────────────

    /**
     * Retorna un raw SQL que, donada la taula `objectes` aliasada `objectes`,
     * calcula la mitjana ponderada per temps de les valoracions del propietari
     * d'aquell objecte (filtrades per aquell objecte).
     *
     * S'utilitza en `orderByRaw()`.
     */
    public static function rawSubqueryWeightedAvgPerObjecte(): string
    {
        $halfLifeSec = self::HALF_LIFE_DAYS * 86400;

        return "(
            SELECT COALESCE(
                SUM(v.puntuacio * EXP(-EXTRACT(EPOCH FROM (NOW() - v.created_at)) / {$halfLifeSec} * LN(2)))
              / NULLIF(SUM(EXP(-EXTRACT(EPOCH FROM (NOW() - v.created_at)) / {$halfLifeSec} * LN(2))), 0),
              NULL
            )
            FROM valoracions v
            WHERE v.objecte_id  = objectes.id
              AND v.valorat_id  = objectes.user_id
        )";
    }
}
