<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class Subcategoria extends Model
{
    use HasFactory;

    protected $table = 'subcategories';

    protected $fillable = [
        'categoria_id',
        'nom',
        'slug',
        'descripcio',
        'activa',
    ];

    protected $casts = [
        'activa' => 'boolean',
    ];

    protected static function booted(): void
    {
        static::creating(function (Subcategoria $sub) {
            if (empty($sub->slug)) {
                $sub->slug = Str::slug($sub->nom);
            }
        });

        static::updating(function (Subcategoria $sub) {
            if ($sub->isDirty('nom')) {
                $sub->slug = Str::slug($sub->nom);
            }
        });
    }

    public function categoria(): BelongsTo
    {
        return $this->belongsTo(Categoria::class, 'categoria_id');
    }

    public function objectes(): HasMany
    {
        return $this->hasMany(Objecte::class, 'subcategoria_id');
    }
}
