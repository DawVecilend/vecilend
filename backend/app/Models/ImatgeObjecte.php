<?php

namespace App\Models;

use App\Services\CloudinaryService;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ImatgeObjecte extends Model {
    protected $table = 'imatges_objecte';
    public $timestamps = false;
    protected $fillable = [
        'objecte_id',
        'url_cloudinary',
        'public_id_cloudinary',
        'ordre',
    ];

    public function objecte(): BelongsTo {
        return $this->belongsTo(Objecte::class, 'objecte_id');
    }

    public function getThumbnailUrlAttribute(): string {
        return app(CloudinaryService::class)->transform($this->url_cloudinary, 'thumbnail');
    }

    public function getMediumUrlAttribute(): string {
        return app(CloudinaryService::class)->transform($this->url_cloudinary, 'medium');
    }
    
    public function getLargeUrlAttribute(): string {
        return app(CloudinaryService::class)->transform($this->url_cloudinary, 'large');
    }
}