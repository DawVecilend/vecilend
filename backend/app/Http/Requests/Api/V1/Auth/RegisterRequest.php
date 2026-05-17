<?php

namespace App\Http\Requests\Api\V1\Auth;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Cache;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;

class RegisterRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'username' => [
                'required',
                'string',
                'max:100',
                'not_regex:/^(admin|vecilend)$/i',
                'unique:users,username',
            ],
            'nom' => ['required', 'string', 'max:100'],
            'cognoms' => ['required', 'string', 'max:150'],
            'email' => [
                'required',
                'string',
                'email',
                'max:255',
                'unique:users,email'
            ],
            'password' => [
                'required',
                'confirmed',
                Password::min(8)->letters()->mixedCase()->numbers()->symbols(),
            ],
            'password_confirmation' => ['required', 'string'],
            'biography' => ['nullable', 'string', 'max:1000'],
            'telefon' => ['nullable', 'string', 'max:20'],
            'direccio' => ['nullable', 'string', 'max:500', Rule::in($this->getMunicipios())],
            'avatar' => ['nullable', 'image', 'mimes:jpeg,png,webp', 'max:3072'],
            'ubicacio' => ['nullable', 'array'],
            'ubicacio.lat' => [
                'required_with:ubicacio',
                'numeric',
                'between:-90,90'
            ],
            'ubicacio.lng' => [
                'required_with:ubicacio',
                'numeric',
                'between:-180,180'
            ],
            'accepta_termes' => ['required', 'accepted']
        ];
    }

    public function messages(): array
    {
        return [
            'avatar.image' => 'El avatar debe ser una imagen.',
            'avatar.mimes' => 'El avatar debe ser JPEG, PNG o WebP.',
            'avatar.max'   => 'El avatar no puede superar los 3 MB.',
            'username.required' => 'El nombre de usuario es obligatorio.',
            'email.unique' => 'Este correo electrónico ya está registrado.',
            'password.confirmed' => 'La confirmación de contraseña no coincide.',
            'password_confirmation.required' => 'La confirmación de contraseña es obligatoria.',
            'accepta_termes.required' => 'Debes aceptar los términos y condiciones.',
            'accepta_termes.accepted' => 'Debes aceptar los términos y condiciones.',
            'direccio.in' => 'El municipio no es válido.',
            'username.unique' => 'Este nombre de usuario ya está en uso.',
            'username.not_regex' => 'Este nombre de usuario está reservado.',
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
