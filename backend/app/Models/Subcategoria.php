<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Subcategoria extends Model {
    use HasFactory;
    protected $table = 'subcategories';
    protected $fillable = [
        'categoria_id',
        'nom',
        'descripcio',
        'activa',
    ];

    protected $casts = [
        'activa' => 'boolean',
    ];

    public function categoria(): BelongsTo {
        return $this->belongsTo(Categoria::class, 'categoria_id');
    }

    public function objectes(): BelongsToMany {
        return $this->belongsToMany(
            Objecte::class,
            'objecte_subcategoria',
            'subcategoria_id',
            'objecte_id'
        );
    }
}