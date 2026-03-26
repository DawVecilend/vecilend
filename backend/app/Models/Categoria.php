<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Categoria extends Model {
    use HasFactory;
    protected $table = 'categories';
    protected $fillable = [
        'nom',
        'icona',
        'descripcio',
        'activa',
    ];

    protected $casts = [
        'activa' => 'boolean',
    ];
    
    public function objectes(): HasMany {
        return $this->hasMany(Objecte::class, 'categoria_id');
    }
    
    public function subcategories(): HasMany {
        return $this->hasMany(Subcategoria::class, 'categoria_id');
    }
    
    public function scopeActives(Builder $query): Builder {
        return $query->where('activa', true);
    }
}