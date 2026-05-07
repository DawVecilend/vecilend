<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Conversa extends Model
{
    use HasFactory;

    protected $table = 'converses';

    protected $fillable = [
        'usuari_1_id',
        'usuari_2_id',
        'objecte_id',
    ];

    // ── Relacions ──

    public function usuari1(): BelongsTo
    {
        return $this->belongsTo(User::class, 'usuari_1_id');
    }

    public function usuari2(): BelongsTo
    {
        return $this->belongsTo(User::class, 'usuari_2_id');
    }

    public function objecte(): BelongsTo
    {
        return $this->belongsTo(Objecte::class, 'objecte_id');
    }

    public function missatges(): HasMany
    {
        return $this->hasMany(Missatge::class, 'conversa_id');
    }

    /**
     * L'últim missatge de la conversa (per a previews al llistat).
     */
    public function ultimMissatge(): HasOne
    {
        return $this->hasOne(Missatge::class, 'conversa_id')->latestOfMany('created_at');
    }

    // ── Helpers ──

    /**
     * Retorna l'altre participant de la conversa, donat l'ID de l'usuari actual.
     */
    public function altreUsuari(int $currentUserId): ?User
    {
        if ($this->usuari_1_id === $currentUserId) {
            return $this->usuari2;
        }
        if ($this->usuari_2_id === $currentUserId) {
            return $this->usuari1;
        }
        return null;
    }

    public function teParticipant(int $userId): bool
    {
        return $this->usuari_1_id === $userId || $this->usuari_2_id === $userId;
    }

    /**
     * Crea o recupera la conversa entre dos usuaris.
     * Respecta el CHECK constraint usuari_1_id < usuari_2_id.
     *
     * @param  int      $userA       qualsevol dels dos
     * @param  int      $userB       qualsevol dels dos
     * @param  ?int     $objecteId   context opcional (només es desa si la conversa és nova)
     * @return self
     */
    public static function firstOrCreateForPair(int $userA, int $userB, ?int $objecteId = null): self
    {
        if ($userA === $userB) {
            throw new \InvalidArgumentException('No es pot crear una conversa amb un mateix.');
        }

        $u1 = min($userA, $userB);
        $u2 = max($userA, $userB);

        return self::firstOrCreate(
            ['usuari_1_id' => $u1, 'usuari_2_id' => $u2],
            ['objecte_id'  => $objecteId]
        );
    }

    /**
     * Compta missatges no llegits dirigits a $userId en aquesta conversa.
     * Pensat com a fallback quan la relació no s'ha carregat amb withCount.
     */
    public function missatgesNoLlegitsPer(int $userId): int
    {
        return $this->missatges()
            ->where('emissor_id', '!=', $userId)
            ->whereNull('llegit_at')
            ->count();
    }

    // ── Scopes ──

    public function scopeDeUsuari(Builder $q, int $userId): Builder
    {
        return $q->where(function ($qq) use ($userId) {
            $qq->where('usuari_1_id', $userId)
                ->orWhere('usuari_2_id', $userId);
        });
    }
}
