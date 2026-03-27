<?php

namespace App\Services;

use CloudinaryLabs\CloudinaryLaravel\Facades\Cloudinary;
use Illuminate\Http\UploadedFile;

class CloudinaryService {
    private const FOLDER_OBJECTES = 'vecilend/objectes';
    private const FOLDER_AVATARS = 'vecilend/avatars';
    private const TRANSFORMS = [
        'thumbnail' => [
            'width' => 200,
            'height' => 200,
            'crop' => 'fill',
            'gravity' => 'auto',
            'quality' => 'auto',
            'fetch_format' => 'auto'
        ],

        'medium' => [
            'width' => 600,
            'height' => 400,
            'crop' => 'fill',
            'gravity' => 'auto',
            'quality' => 'auto',
            'fetch_format' => 'auto'
        ],

        'large' => [
            'width' => 1200,
            'height' => 800,
            'crop' => 'limit',
            'quality' => 'auto',
            'fetch_format' => 'auto'
        ],

        'avatar' => [
            'width' => 150,
            'height' => 150,
            'crop' => 'thumb',
            'gravity' => 'face',
            'quality' => 'auto',
            'fetch_format' => 'auto',
        ],
    ];
    
    public function uploadObjecteImage(UploadedFile $file, int $objecteId): array {
        $result = Cloudinary::upload($file->getRealPath(), [
            'folder' => self::FOLDER_OBJECTES . '/' .$objecteId,
            'resource_type' => 'image',
            'allowed_formats' => ['jpg', 'jpeg', 'png', 'webp'],
            'max_bytes' => 10 * 1024 * 1024,
            'transformation' => [
                'quality' => 'auto',
                'fetch_format' => 'auto',
            ],
        ]);
        
        return [
            'url' => $result->getSecurePath(),
            'public_id' => $result->getPublicId(),
        ];
    }
    
    public function uploadAvatar(UploadedFile $file, int $userId): array {
        $result = Cloudinary::upload($file->getRealPath(), [
            'folder' => self::FOLDER_AVATARS,
            'public_id' => 'user_' . $userId,
            'overwrite' => true,
            'resource_type' => 'image',
            'allowed_formats' => ['jpg', 'jpeg', 'png', 'webp'],
            'max_bytes' => 5 * 1024 * 1024,
            'transformation' => [
                'width' => 500,
                'height' => 500,
                'crop' => 'limit',
                'quality' => 'auto',
                'fetch_format' => 'auto'
            ],
        ]);
        
        return [
            'url' => $result->getSecurePath(),
            'public_id' => $result->getPublicId(),
        ];
    }
    
    public function delete(string $publicId): bool {
        $result = Cloudinary::destroy($publicId);
        return $result->getResult() === 'ok';
    }

    public function deleteMultiple(array $publicIds): void {
        foreach ($publicIds as $publicId) {
            $this->delete($publicId);
        }
    }

    public function transform(string $originalUrl, string $transform): string {
        if (!isset(self::TRANSFORMS[$transform])) {
            return $originalUrl;
        }

        $params = self::TRANSFORMS[$transform];
        $transformString = $this->buildTransformString($params);
        
        return preg_replace(
            '#(/image/upload/)#',
            '$1' . $transformString . '/',
            $originalUrl
        );
    }

    public function allTransforms(string $originalUrl): array {
        $urls = [];
        foreach (array_keys(self::TRANSFORMS) as $name) {
            $urls[$name] = $this->transform($originalUrl, $name);
        }

        return $urls;
    }
    
    private function buildTransformString(array $params): string {
        $map = [
            'width' => 'w',
            'height' => 'h',
            'crop' => 'c',
            'gravity' => 'g',
            'quality' => 'q',
            'fetch_format' => 'f',
        ];
        
        $parts = [];
        foreach ($params as $key => $value) {
            $prefix = $map[$key] ?? $key;
            $parts[] = $prefix . '_' . $value;
        }
        
        return implode(',', $parts);
    }
}