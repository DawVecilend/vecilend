<?php

namespace App\Http\Requests\Api\V1\Auth;

use Illuminate\Foundation\Http\FormRequest;
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
            'telefon' => ['nullable', 'string', 'max:20'],
            'direccio' => ['nullable', 'string', 'max:500'],
            'avatar_url' => ['nullable', 'url', 'max:500'],
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
            'email.unique' => 'Aquest correu electrònic ja està registrat.',
            'password.confirmed' => 'La confirmació de contrasenya no coincideix.',
            'accepta_termes.required' => 'Has d\'acceptar els termes i condicions.',
            'accepta_termes.accepted' => 'Has d\'acceptar els termes i condicions.'
        ];
    }
}