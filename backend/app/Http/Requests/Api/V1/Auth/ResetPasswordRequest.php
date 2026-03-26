<?php

namespace App\Http\Requests\Api\V1\Auth;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Password;

class ResetPasswordRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'token'    => ['required', 'string'],
            'email'    => ['required', 'string', 'email'],
            'password' => [
                'required',
                'confirmed',
                // Mateixa política que RegisterRequest
                Password::min(8)->letters()->mixedCase()->numbers()->symbols(),
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'token.required'     => 'El token de recuperació és obligatori.',
            'password.confirmed' => 'La confirmació de contrasenya no coincideix.',
        ];
    }
}
