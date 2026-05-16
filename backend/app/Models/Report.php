<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Report extends Model
{
    use HasFactory;

    protected $table = 'reports';

    public const MOTIU_COMPORTAMENT      = 'comportament_inapropiat';
    public const MOTIU_OBJECTE_INAPROPIAT = 'objecte_inapropiat';
    public const MOTIU_FRAU              = 'frau_o_estafa';
    public const MOTIU_SUPLANTACIO       = 'suplantacio_identitat';
    public const MOTIU_SPAM              = 'spam';
    public const MOTIU_ALTRES            = 'altres';

    public const ESTAT_PENDENT    = 'pendent';
    public const ESTAT_RESOLT     = 'resolt';
    public const ESTAT_DESCARTAT  = 'descartat';

    /**
     * Motivos disponibles para crear nuevos reportes.
     * 'altres' se mantiene como constante para compatibilidad con
     * reportes históricos, pero ya no se acepta como motivo nuevo.
     */
    public static function motiusDisponibles(): array
    {
        return [
            self::MOTIU_COMPORTAMENT,
            self::MOTIU_OBJECTE_INAPROPIAT,
            self::MOTIU_FRAU,
            self::MOTIU_SUPLANTACIO,
            self::MOTIU_SPAM,
        ];
    }

    protected $fillable = [
        'reportador_id',
        'usuari_reportat_id',
        'objecte_id',
        'motiu',
        'descripcio',
        'estat',
        'revisor_id',
        'resolucio_nota',
        'resolt_at',
    ];

    protected $casts = [
        'resolt_at' => 'datetime',
    ];

    public function reportador(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reportador_id');
    }

    public function usuariReportat(): BelongsTo
    {
        return $this->belongsTo(User::class, 'usuari_reportat_id');
    }

    public function objecte(): BelongsTo
    {
        return $this->belongsTo(Objecte::class, 'objecte_id');
    }

    public function revisor(): BelongsTo
    {
        return $this->belongsTo(Empleat::class, 'revisor_id');
    }
}
