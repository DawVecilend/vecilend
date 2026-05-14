<?php

namespace App\Http\Requests\Api\V1;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Password;

class StoreEmpleatRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'username' => ['required', 'string', 'max:100', 'unique:empleats,username'],
            'nom'      => ['required', 'string', 'max:100'],
            'cognoms'  => ['required', 'string', 'max:150'],
            'email'    => ['required', 'string', 'email', 'max:255', 'unique:empleats,email'],
            'password' => [
                'required',
                'confirmed',
                Password::min(8)->letters()->mixedCase()->numbers()->symbols(),
            ],
            'password_confirmation' => ['required', 'string'],
            'rol'      => ['required', 'string', 'in:admin,suport'],
            'actiu'    => ['nullable', 'boolean'],
        ];
    }

    public function messages(): array
    {
        return [
            'username.unique' => 'Este nombre de usuario ya está en uso.',
            'email.unique'    => 'Este correo electrónico ya está registrado.',
            'password.confirmed' => 'La confirmación de contraseña no coincide.',
            'rol.in'          => 'El rol debe ser admin o suport.',
        ];
    }
}
