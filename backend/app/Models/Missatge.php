<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Missatge extends Model
{
    use HasFactory;

    protected $table = 'missatges';

    /**
     * La taula només té created_at; no hi ha updated_at.
     */
    public $timestamps = false;

    protected $fillable = [
        'conversa_id',
        'emissor_id',
        'objecte_id',
        'respon_a_id',
        'contingut',
        'llegit_at',
        'created_at',
    ];

    protected $casts = [
        'llegit_at'  => 'datetime',
        'created_at' => 'datetime',
    ];

    public function conversa(): BelongsTo
    {
        return $this->belongsTo(Conversa::class, 'conversa_id');
    }

    public function emissor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'emissor_id');
    }

    /**
     * Objecte associat al missatge (nullable).
     * Es fa servir per generar l'etiqueta "Sobre <objecte>" quan
     * la solicitud es refereix a un objecte concret.
     */
    public function objecte(): BelongsTo
    {
        return $this->belongsTo(Objecte::class, 'objecte_id');
    }

    /**
     * Missatge que aquest missatge cita/respon (nullable).
     */
    public function responA(): BelongsTo
    {
        return $this->belongsTo(Missatge::class, 'respon_a_id');
    }
}
