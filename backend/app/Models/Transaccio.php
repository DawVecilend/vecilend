<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

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

    public function pagaments(): HasMany
    {
        return $this->hasMany(Pagament::class, 'transaccio_id');
    }

    /**
     * Accés directe a l'objecte via la sol·licitud.
     */
    public function objecte(): \Illuminate\Database\Eloquent\Relations\HasOneThrough
    {
        return $this->hasOneThrough(
            Objecte::class,
            Solicitud::class,
            'id',
            'id',
            'solicitud_id',
            'objecte_id'
        );
    }

    // ── Helpers ──

    /**
     * True si la transacció té un pagament en estat 'completat'.
     * Requereix que la relació pagaments estigui carregada per evitar N+1.
     */
    public function estaPagada(): bool
    {
        if (!$this->relationLoaded('pagaments')) {
            return $this->pagaments()->where('estat', Pagament::ESTAT_COMPLETAT)->exists();
        }

        return $this->pagaments->contains(fn($p) => $p->estat === Pagament::ESTAT_COMPLETAT);
    }
}
