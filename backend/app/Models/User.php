<?php

namespace App\Models;

use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\DB;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use App\Models\Objecte;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'username',
        'nom',
        'cognoms',
        'email',
        'password',
        'biography',
        'telefon',
        'direccio',
        'avatar_url',
        'avatar_public_id',
        'google_id',
        'ubicacio',
        'radi_proximitat',
        'rol',
        'actiu',
    ];

    protected $hidden = ['password', 'remember_token'];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password'          => 'hashed',
            'actiu'             => 'boolean',
            'radi_proximitat'   => 'integer',
        ];
    }

    protected static function booted(): void
    {
        ResetPassword::createUrlUsing(function (User $user, string $token) {
            return config('app.frontend_url')
                . '/reset-password?token=' . $token
                . '&email=' . urlencode($user->email);
        });
    }

    public function coordenades(): ?array
    {
        if (! $this->ubicacio) {
            return null;
        }

        $point = DB::selectOne(
            'SELECT ST_X(ubicacio::geometry) as lng, ST_Y(ubicacio::geometry) as lat FROM users WHERE id = ?',
            [$this->id]
        );

        return $point ? ['lat' => $point->lat, 'lng' => $point->lng] : null;
    }

    /**
     * Sobreescrivim la notificació de reset perquè utilitzi el nostre
     * PasswordResetMail amb la plantilla blade personalitzada.
     */
    public function sendPasswordResetNotification($token): void
    {
        $resetUrl = config('app.frontend_url')
            . '/reset-password?token=' . $token
            . '&email=' . urlencode($this->email);

        \Illuminate\Support\Facades\Mail::to($this->email)
            ->send(new \App\Mail\PasswordResetMail($resetUrl, $this->nom));
    }

    /**
     * Sol·licituds que aquest usuari ha fet (com a sol·licitant).
     */
    public function solicituds(): HasMany
    {
        return $this->hasMany(Solicitud::class, 'solicitant_id');
    }

    /**
     * Sol·licituds rebudes per aquest usuari (com a propietari dels seus objectes).
     */
    public function solicitudsRebudes(): \Illuminate\Database\Eloquent\Relations\HasManyThrough
    {
        return $this->hasManyThrough(
            Solicitud::class,
            Objecte::class,
            'user_id',     // FK a objectes (propietari)
            'objecte_id',  // FK a solicituds
            'id',          // PK a users
            'id'           // PK a objectes
        );
    }

    /**
     * Stats com a propietari (mitjana ponderada per temps + total).
     */
    public static function statsComPropietari(int $userId): array
    {
        return \App\Models\Valoracio::statsUsuari($userId, 'propietari');
    }

    /**
     * Stats com a sol·licitant.
     */
    public static function statsComSolicitant(int $userId): array
    {
        return \App\Models\Valoracio::statsUsuari($userId, 'solicitant');
    }

    /**
     * Versió bulk per a llistats: només mitjana com a propietari per usuari.
     */
    public static function statsPropietariBulk(array $userIds): array
    {
        if (empty($userIds)) return [];

        $rows = \App\Models\Valoracio::query()
            ->whereIn('valoracions.valorat_id', $userIds)
            ->join('objectes', function ($j) {
                $j->on('objectes.id', '=', 'valoracions.objecte_id')
                    ->on('objectes.user_id', '=', 'valoracions.valorat_id');
            })
            ->select('valoracions.valorat_id', 'valoracions.puntuacio', 'valoracions.created_at')
            ->orderBy('valoracions.created_at')
            ->get();

        $grouped = $rows->groupBy('valorat_id');

        $result = [];
        foreach ($userIds as $id) {
            $stats = \App\Models\Valoracio::query()->getModel(); // qualsevol per accedir al mètode
            // utilitzem reflection del helper privat via wrapper públic
            $rowsUser = $grouped->get($id) ?? collect();
            $result[$id] = self::computeStatsFromRows($rowsUser);
        }
        return $result;
    }

    /**
     * Helper públic perquè el bulk pugui calcular stats sense duplicar codi.
     */
    public static function computeStatsFromRows(\Illuminate\Support\Collection $rows): array
    {
        if ($rows->isEmpty()) return ['avg' => null, 'total' => 0];

        $now           = now();
        $totalWeight   = 0.0;
        $weightedSum   = 0.0;
        $halfLifeSec   = \App\Models\Valoracio::HALF_LIFE_DAYS * 86400;

        foreach ($rows as $row) {
            $createdAt = $row->created_at instanceof \DateTimeInterface
                ? $row->created_at
                : \Carbon\Carbon::parse($row->created_at);

            $ageSec = max(0, $now->getTimestamp() - $createdAt->getTimestamp());
            $weight = pow(0.5, $ageSec / $halfLifeSec);

            $weightedSum += ((int) $row->puntuacio) * $weight;
            $totalWeight += $weight;
        }

        return [
            'avg'   => $totalWeight > 0 ? round($weightedSum / $totalWeight, 1) : null,
            'total' => $rows->count(),
        ];
    }

    /**
     * Compta el total de transaccions (finalitzades o en curs) en què l'usuari
     * ha participat — com a propietari o com a sol·licitant.
     */
    public static function totalTransaccions(int $userId): int
    {
        return \App\Models\Transaccio::query()
            ->whereIn('estat', ['en_curs', 'finalitzat'])
            ->where(function ($q) use ($userId) {
                $q->whereHas('solicitud', fn($sq) => $sq->where('solicitant_id', $userId))
                    ->orWhereHas('solicitud.objecte', fn($oq) => $oq->where('user_id', $userId));
            })
            ->count();
    }

    /**
     * Objectes que aquest usuari ha marcat com a favorits.
     */
    public function favorits(): BelongsToMany
    {
        return $this->belongsToMany(
            Objecte::class,
            'favorits',
            'user_id',
            'objecte_id'
        )->withPivot('created_at');
    }
}
