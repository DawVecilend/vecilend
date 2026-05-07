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
}
