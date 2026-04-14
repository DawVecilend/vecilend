<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class Categoria extends Model
{
    use HasFactory;

    protected $table = 'categories';

    protected $fillable = [
        'nom',
        'slug',
        'icona',
        'descripcio',
        'activa',
    ];

    protected $casts = [
        'activa' => 'boolean',
    ];

    // ── Auto-generar slug ──
    protected static function booted(): void
    {
        static::creating(function (Categoria $cat) {
            if (empty($cat->slug)) {
                $cat->slug = Str::slug($cat->nom);
            }
        });

        static::updating(function (Categoria $cat) {
            if ($cat->isDirty('nom')) {
                $cat->slug = Str::slug($cat->nom);
            }
        });
    }

    // ── Relacions ──
    public function objectes(): HasMany
    {
        return $this->hasMany(Objecte::class, 'categoria_id');
    }

    public function subcategories(): HasMany
    {
        return $this->hasMany(Subcategoria::class, 'categoria_id');
    }

    // ── Scopes ──
    public function scopeActives(Builder $query): Builder
    {
        return $query->where('activa', true);
    }
}
