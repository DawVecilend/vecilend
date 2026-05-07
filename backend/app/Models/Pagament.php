<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Pagament extends Model
{
    use HasFactory;

    protected $table = 'pagaments';

    protected $fillable = [
        'transaccio_id',
        'pagador_id',
        'tipus',
        'import',
        'estat',
        'metode_pagament',
        'referencia_mock',
        'notes',
    ];

    protected $casts = [
        'import' => 'decimal:2',
    ];

    // Estats suportats
    public const ESTAT_PENDENT   = 'pendent';
    public const ESTAT_COMPLETAT = 'completat';
    public const ESTAT_FALLIT    = 'fallit';

    public function transaccio(): BelongsTo
    {
        return $this->belongsTo(Transaccio::class, 'transaccio_id');
    }

    public function pagador(): BelongsTo
    {
        return $this->belongsTo(User::class, 'pagador_id');
    }
}
