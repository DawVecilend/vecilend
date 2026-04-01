<?php

namespace App\Http\Requests\Api\V1\Auth;

use Illuminate\Foundation\Http\FormRequest;

class LoginRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // Qualsevol pot intentar fer login
    }

    public function rules(): array
    {
        return [
            'email'    => ['required', 'string', 'email'],
            'password' => ['required', 'string'],
        ];
    }

    public function messages(): array
    {
        return [
            'email.required'    => "El camp email és obligatori.",
            'email.email'       => "El format de l'email no és vàlid.",
            'password.required' => 'El camp contrasenya és obligatori.',
        ];
    }
}
