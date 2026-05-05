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
     * Calcula la valoració mitjana i total d'un usuari (com a propietari d'objectes).
     * Retorna ['avg' => float|null, 'total' => int].
     */
    public static function getValoracioStats(int $userId): array
    {
        $stats = DB::table('valoracions')
            ->join('transaccions', 'transaccions.id', '=', 'valoracions.transaccio_id')
            ->join('solicituds', 'solicituds.id', '=', 'transaccions.solicitud_id')
            ->join('objectes', 'objectes.id', '=', 'solicituds.objecte_id')
            ->where('objectes.user_id', $userId)
            ->selectRaw('AVG(valoracions.puntuacio) as avg_rating, COUNT(*) as total')
            ->first();

        return [
            'avg'   => $stats->avg_rating !== null ? round((float) $stats->avg_rating, 1) : null,
            'total' => (int) ($stats->total ?? 0),
        ];
    }

    /**
     * Versió bulk per evitar N+1 en llistats. Retorna [userId => ['avg', 'total']].
     */
    public static function getValoracionsBulk(array $userIds): array
    {
        if (empty($userIds)) return [];

        $rows = DB::table('valoracions')
            ->join('transaccions', 'transaccions.id', '=', 'valoracions.transaccio_id')
            ->join('solicituds', 'solicituds.id', '=', 'transaccions.solicitud_id')
            ->join('objectes', 'objectes.id', '=', 'solicituds.objecte_id')
            ->whereIn('objectes.user_id', $userIds)
            ->groupBy('objectes.user_id')
            ->selectRaw('objectes.user_id, AVG(valoracions.puntuacio) as avg_rating, COUNT(*) as total')
            ->get()
            ->keyBy('user_id');

        $result = [];
        foreach ($userIds as $id) {
            $row = $rows->get($id);
            $result[$id] = [
                'avg'   => $row && $row->avg_rating !== null ? round((float) $row->avg_rating, 1) : null,
                'total' => (int) ($row->total ?? 0),
            ];
        }
        return $result;
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
