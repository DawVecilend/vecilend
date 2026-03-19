<?php

namespace App\Models;

use Illuminate\Support\Facades\DB;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable {
    use HasApiTokens, HasFactory, Notifiable;
    
    protected $fillable = ['nom', 'cognoms', 'email', 'password', 'telefon', 'direccio', 'avatar_url', 'google_id', 'ubicacio', 'radi_proximitat', 'rol', 'actiu'];
    protected $hidden = ['password', 'remember_token'];
    
    
    protected function casts(): array {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'actiu' => 'boolean',
            'radi_proximitat' => 'integer'
        ];
    }

    public function coordenades(): ?array {
        if (! $this->ubicacio) {
            return null;
        }

        $point = DB::selectOne(
            'SELECT ST_X(ubicacio::geometry) as lng, ST_Y(ubicacio::geometry)
            as lat FROM users WHERE id = ?',
            [$this->id]
        );
        
        return $point ? ['lat' => $point->lat, 'lng' => $point->lng] : null;
    }
}