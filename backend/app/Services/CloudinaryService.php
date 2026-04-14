<?php

namespace App\Services;

use Cloudinary\Cloudinary;
use Illuminate\Http\UploadedFile;

class CloudinaryService
{
    private Cloudinary $cloudinary;

    public function __construct()
    {
        $this->cloudinary = app(Cloudinary::class);
    }

    public function upload(UploadedFile $file, string $folder = 'vecilend/objectes'): array
    {
        $result = $this->cloudinary->uploadApi()->upload(
            $file->getRealPath(),
            [
                'folder'        => $folder,
                'resource_type' => 'image',
            ]
        );

        return [
            'public_id' => $result['public_id'],
            'url'       => $result['secure_url'],
        ];
    }

    public function delete(string $publicId): bool
    {
        $result = $this->cloudinary->uploadApi()->destroy($publicId);

        return ($result['result'] ?? '') === 'ok';
    }

    /**
     * Genera URL amb transformació inserida directament.
     *
     * Cloudinary aplica transformacions via URL:
     *   /image/upload/c_fill,g_auto,h_200,w_200,q_auto,f_auto/public_id
     *
     * En comptes de dependre de classes del SDK que canvien entre versions,
     * construïm la URL inserint els paràmetres de transformació.
     */
    public function transform(string $publicId, string $preset = 'thumbnail'): string
    {
        $presets = [
            'thumbnail' => 'c_fill,g_auto,w_200,h_200,q_auto,f_auto',
            'medium'    => 'c_fill,g_auto,w_600,h_400,q_auto,f_auto',
        ];

        $transformation = $presets[$preset] ?? $presets['thumbnail'];

        // Obtenim la URL base sense transformacions
        $baseUrl = $this->cloudinary->image($publicId)->toUrl();

        // La URL és: .../image/upload/v1234/public_id.ext
        // Cal inserir la transformació entre "upload/" i "v1234/"
        return preg_replace(
            '#(/image/upload/)#',
            '$1' . $transformation . '/',
            (string) $baseUrl
        );
    }
}
