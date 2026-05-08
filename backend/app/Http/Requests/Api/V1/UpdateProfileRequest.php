<?php

namespace App\Http\Requests\Api\V1;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Cache;
use Illuminate\Validation\Rule;

class UpdateProfileRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'nom'             => ['required', 'string', 'max:100'],
            'cognoms'         => ['required', 'string', 'max:150'],
            'telefon'         => ['nullable', 'string', 'max:20'],
            'direccio'        => ['nullable', 'string', 'max:500', Rule::in($this->getMunicipios())],
            'biography'       => ['nullable', 'string', 'max:255'],
            'avatar'          => ['nullable', 'image', 'mimes:jpeg,png,jpg,webp', 'max:3072'],
            'ubicacio'        => ['nullable', 'array'],
            'ubicacio.lat'    => ['required_with:ubicacio', 'numeric', 'between:-90,90'],
            'ubicacio.lng'    => ['required_with:ubicacio', 'numeric', 'between:-180,180'],
        ];
    }

    public function messages(): array
    {
        return [
            'direccio.in'  => 'El municipi seleccionat no és vàlid.',
            'avatar.image' => 'L\'avatar ha de ser una imatge.',
            'avatar.mimes' => 'L\'avatar ha de ser de format: jpeg, png, jpg o webp.',
            'avatar.max'   => 'L\'avatar no pot superar els 3 MB.',
        ];
    }

    private function getMunicipios(): array
    {
        return Cache::rememberForever('municipios_list', function () {
            $path = database_path('data/municipios.json');
            if (!file_exists($path)) {
                return [];
            }

            $rows = json_decode(file_get_contents($path), true);
            return array_column($rows ?? [], 'name');
        });
    }
}
