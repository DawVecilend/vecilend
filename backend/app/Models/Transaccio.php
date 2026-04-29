<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;

class Transaccio extends Model
{
    use HasFactory;

    protected $table = 'transaccions';

    protected $fillable = [
        'solicitud_id',
        'data_inici_real',
        'data_fi_real',
        'estat',
    ];

    protected $casts = [
        'data_inici_real' => 'datetime',
        'data_fi_real'    => 'datetime',
    ];

    // ── Relacions ──

    public function solicitud(): BelongsTo
    {
        return $this->belongsTo(Solicitud::class, 'solicitud_id');
    }

    /**
     * Accés directe a l'objecte via la sol·licitud (per a queries còmodes
     * com $transaccio->objecte sense haver d'encadenar ->solicitud->objecte).
     */
    public function objecte(): \Illuminate\Database\Eloquent\Relations\HasOneThrough
    {
        return $this->hasOneThrough(
            Objecte::class,
            Solicitud::class,
            'id',          // FK a solicituds (pk)
            'id',          // FK a objectes (pk)
            'solicitud_id', // FK local a transaccions
            'objecte_id'   // FK a solicituds que apunta a objectes
        );
    }
}
