<?php

namespace App\Models;

use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\DB;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\Relations\HasMany;
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
}
