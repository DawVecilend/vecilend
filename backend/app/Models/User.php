<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable {
    use HasApiTokens, HasFactory, Notifiable;
    
    protected $fillable = ['nom', 'cognoms', 'email', 'password', 'avatar_url', 'google_id', 'ubicacio', 'radi_proximitat', 'rol', 'actiu'];
    protected $hidden = ['password', 'remember_token'];
    
    protected function casts(): array {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'actiu' => 'boolean',
            'radi_proximitat' => 'integer'
        ];
    }
}