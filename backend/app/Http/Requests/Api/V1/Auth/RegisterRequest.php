<?php

namespace App\Http\Requests\Api\V1\Auth;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;

class RegisterRequest extends FormRequest {
    public function authorize(): bool {
        return true;
    }

    public function rules(): array {
        return [
            'username' => ['required', 'string', 'max:100'],
            'nom' => ['required', 'string', 'max:100'],
            'cognoms' => ['required', 'string', 'max:150'],
            'email' => ['required', 'string', 'email', 'max:255',
            'unique:users,email'],
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
            'ubicacio.lat' => ['required_with:ubicacio', 'numeric',
            'between:-90,90'],
            'ubicacio.lng' => ['required_with:ubicacio', 'numeric',
            'between:-180,180'],
            'radi_proximitat' => ['nullable', 'integer', 'between:1,50'],
            'accepta_termes' => ['required', 'accepted']
        ];
    }

    public function messages(): array {
        return [
            'avatar.image' => 'L\'avatar ha de ser una imatge.',
            'avatar.mimes' => 'L\'avatar ha de ser JPEG, PNG o WebP.',
            'avatar.max'   => 'L\'avatar no pot superar els 3 MB.',
            'username.required' => 'El camp nom d\'usuari és obligatori.',
            'email.unique' => 'Aquest correu electrònic ja està registrat.',
            'password.confirmed' => 'La confirmació de contrasenya no coincideix.',
            'password_confirmation.required' => 'La confirmació de contrasenya és obligatòria.',
            'accepta_termes.required' => 'Has d\'acceptar els termes i condicions.',
            'accepta_termes.accepted' => 'Has d\'acceptar els termes i condicions.',
            'direccio.in' => 'El municipi no és vàlid.',
        ];
    }

    private function getMunicipios(): array {
        $path = database_path('data/municipios.json');
        if (!file_exists($path)) {
            return [];
        }
        
        $json = json_decode(file_get_contents($path), true);
        return array_column($json['data'] ?? [], 9);
    }
}