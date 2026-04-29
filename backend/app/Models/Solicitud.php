<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Solicitud extends Model
{
    use HasFactory;

    protected $table = 'solicituds';

    protected $fillable = [
        'solicitant_id',
        'objecte_id',
        'data_inici',
        'data_fi',
        'tipus',
        'missatge',
        'estat',
    ];

    protected $casts = [
        'data_inici' => 'date',
        'data_fi'    => 'date',
    ];

    // ── Relacions ──

    /**
     * L'usuari que fa la petició (en l'API exposat com 'requester').
     */
    public function solicitant(): BelongsTo
    {
        return $this->belongsTo(User::class, 'solicitant_id');
    }

    /**
     * L'objecte sol·licitat. Inclou l'accés al propietari via $solicitud->objecte->user.
     */
    public function objecte(): BelongsTo
    {
        return $this->belongsTo(Objecte::class, 'objecte_id');
    }

    /**
     * La transacció és la fase activa del préstec/lloguer (existeix només
     * un cop la sol·licitud ha sigut acceptada).
     */
    public function transaccio(): HasOne
    {
        return $this->hasOne(Transaccio::class, 'solicitud_id');
    }

    // ── Scopes útils ──

    public function scopePendents(Builder $query): Builder
    {
        return $query->where('estat', 'pendent');
    }

    public function scopeAcceptades(Builder $query): Builder
    {
        return $query->where('estat', 'acceptat');
    }

    /**
     * Sol·licituds que ocupen un objecte en un rang concret (per validar
     * disponibilitat de dates en una nova petició).
     *
     * Solapament: dues franges [a1,a2] i [b1,b2] se solapen si a1 ≤ b2 i a2 ≥ b1.
     */
    public function scopeOcupenDates(
        Builder $query,
        int $objecteId,
        string $dataInici,
        string $dataFi
    ): Builder {
        return $query
            ->where('objecte_id', $objecteId)
            ->where('estat', 'acceptat')
            ->where('data_inici', '<=', $dataFi)
            ->where('data_fi', '>=', $dataInici);
    }
}
