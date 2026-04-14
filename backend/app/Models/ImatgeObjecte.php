<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ImatgeObjecte extends Model
{
    protected $table = 'imatges_objecte';
    public $timestamps = false;

    protected $fillable = [
        'objecte_id',
        'url_cloudinary',
        'public_id_cloudinary',
        'ordre',
    ];

    protected $casts = [
        'ordre' => 'integer',
    ];

    public function objecte(): BelongsTo
    {
        return $this->belongsTo(Objecte::class, 'objecte_id');
    }
}
