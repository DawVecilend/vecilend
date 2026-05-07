<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Notificacio extends Model
{
    use HasFactory;

    protected $table = 'notificacions';

    /**
     * La taula només té created_at; no hi ha updated_at.
     */
    public $timestamps = false;

    protected $fillable = [
        'user_id',
        'tipus',
        'titol',
        'missatge',
        'entitat_referenciada',
        'id_entitat_referenciada',
        'llegida',
        'created_at',
    ];

    protected $casts = [
        'llegida'    => 'boolean',
        'created_at' => 'datetime',
    ];

    // Tipus suportats (mantenir sincronitzat amb el frontend)
    public const TIPUS_SOLICITUD_REBUDA    = 'solicitud_rebuda';
    public const TIPUS_SOLICITUD_ACCEPTADA = 'solicitud_acceptada';
    public const TIPUS_SOLICITUD_REBUTJADA = 'solicitud_rebutjada';
    public const TIPUS_VALORACIO_REBUDA    = 'valoracio_rebuda';

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
