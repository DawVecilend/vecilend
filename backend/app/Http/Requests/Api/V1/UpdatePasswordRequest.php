<?php

namespace App\Http\Requests\Api\V1;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;

class UpdatePasswordRequest extends FormRequest {
    public function authorize(): bool {
        return Auth::check();
    }

    public function rules(): array {
        return [
            'current_password' => [
                'required', 
                'string', 
                function ($attribute, $value, $fail) {
                    if (!Hash::check($value, $this->user()->password)) {
                        $fail('La contraseña actual no es correcta.');
                    }
                }
            ],
            'password' => [
                'required',
                Password::min(8)->letters()->mixedCase()->numbers()->symbols(),
                'string',
                'confirmed',
                'different:current_password'
            ],
        ];
    }

    public function messages(): array {
        return [
            'current_password.required' => 'Debes introducir tu contraseña actual.',
            'current_password.current_password' => 'La contraseña actual no es correcta.',
            'password.required' => 'La nueva contraseña es obligatoria.',
            'password.min' => 'La nueva contraseña debe tener al menos 8 caracteres.',
            'password.letters' => 'La nueva contraseña debe contener letras.',
            'password.mixedCase' => 'La nueva contraseña debe contener letras mayúsculas y minúsculas.',
            'password.numbers' => 'La nueva contraseña debe contener números.',
            'password.symbols' => 'La nueva contraseña debe contener símbolos.',
            'password.confirmed' => 'Las contraseñas no coinciden.',
            'password.different' => 'La nueva contraseña tiene que ser distinta a la actual.',


        ];
    }
}