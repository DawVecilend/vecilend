<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class Empleat extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $table = 'empleats';

    public const ROL_ADMIN  = 'admin';
    public const ROL_SUPORT = 'suport';

    protected $fillable = [
        'username',
        'nom',
        'cognoms',
        'email',
        'password',
        'rol',
        'actiu',
    ];

    protected $hidden = ['password', 'remember_token'];

    protected function casts(): array
    {
        return [
            'password' => 'hashed',
            'actiu'    => 'boolean',
        ];
    }

    public function esAdmin(): bool
    {
        return $this->rol === self::ROL_ADMIN;
    }

    public function esSuport(): bool
    {
        return $this->rol === self::ROL_SUPORT;
    }
}
