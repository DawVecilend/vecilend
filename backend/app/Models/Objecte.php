<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class Objecte extends Model
{
    use HasFactory;
    protected $table = 'objectes';
    protected $casts = ['preu_diari' => 'decimal:2'];
    protected $fillable = [
        'user_id',
        'categoria_id',
        'nom',
        'slug',
        'descripcio',
        'tipus',
        'preu_diari',
        'estat',
        'ubicacio',
    ];

    protected static function booted(): void
    {
        static::creating(function (Objecte $objecte) {
            if (empty($objecte->slug)) {
                $objecte->slug = Str::slug($objecte->nom);
            }
        });

        static::updating(function (Objecte $objecte) {
            if ($objecte->isDirty('nom')) {
                $objecte->slug = Str::slug($objecte->nom);
            }
        });
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function categoria(): BelongsTo
    {
        return $this->belongsTo(Categoria::class, 'categoria_id');
    }

    public function subcategories(): BelongsToMany
    {
        return $this->belongsToMany(
            Subcategoria::class,
            'objecte_subcategoria',
            'objecte_id',
            'subcategoria_id'
        );
    }

    public function imatges(): HasMany
    {
        return $this->hasMany(ImatgeObjecte::class, 'objecte_id')->orderBy('ordre');
    }

    public function solicituds(): HasMany
    {
        return $this->hasMany(Solicitud::class, 'objecte_id');
    }

    public function transaccions(): HasManyThrough
    {
        return $this->hasManyThrough(
            Transaccio::class,
            Solicitud::class,
            'objecte_id',
            'solicitud_id',
            'id',
            'id'
        );
    }


    public function favoritsPer(): BelongsToMany
    {
        return $this->belongsToMany(
            User::class,
            'favorits',
            'objecte_id',
            'user_id'
        )->withPivot('created_at');
    }

    public function scopeDisponible(Builder $query): Builder
    {
        return $query->where('estat', 'disponible');
    }

    public function scopePerCategoria(Builder $query, int $categoriaId): Builder
    {
        return $query->where('categoria_id', $categoriaId);
    }

    public function scopeCerca(Builder $query, string $terme): Builder
    {
        $terme = '%' . $terme . '%';
        return $query->where(function (Builder $q) use ($terme) {
            $q->where('nom', 'ILIKE', $terme)->orWhere('descripcio', 'ILIKE', $terme);
        });
    }

    public function scopeAProximitat(Builder $query, float $lat, float $lng, int $metres = 5000): Builder
    {
        return $query->whereRaw('ST_DWithin(ubicacio, ST_SetSRID(ST_MakePoint(?, ?),4326)::geography, ?)', [$lng, $lat, $metres]);
    }

    public static function setUbicacio(int $objecteId, float $lat, float $lng): void
    {
        DB::statement('UPDATE objectes SET ubicacio = ST_SetSRID(ST_MakePoint(?,?), 4326)::geography WHERE id = ?', [$lng, $lat, $objecteId]);
    }

    public function coordenades(): ?array
    {
        if (! $this->ubicacio) {
            return null;
        }

        $point = DB::selectOne('SELECT ST_X(ubicacio::geometry) as lng, ST_Y(ubicacio::geometry) as lat FROM objectes WHERE id = ?', [$this->id]);
        return $point ? ['lat' => $point->lat, 'lng' => $point->lng] : null;
    }

    public function scopeAmbCoordenades(Builder $query): Builder
    {
        return $query->selectRaw('*, ST_Y(ubicacio::geometry) as lat, ST_X(ubicacio::geometry) as lng');
    }
}
