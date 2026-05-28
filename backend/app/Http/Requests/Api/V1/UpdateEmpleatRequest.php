<?php

namespace App\Http\Requests\Api\V1;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;

class UpdateEmpleatRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $id = $this->route('id');

        return [
            'username' => ['sometimes', 'string', 'max:100', Rule::unique('empleats', 'username')->ignore($id)],
            'nom'      => ['sometimes', 'string', 'max:100', 'not_regex:/\p{N}/u'],
            'cognoms'  => ['sometimes', 'string', 'max:150', 'not_regex:/\p{N}/u'],
            'email'    => ['sometimes', 'string', 'email', 'max:255', Rule::unique('empleats', 'email')->ignore($id)],
            'password' => [
                'sometimes',
                'confirmed',
                Password::min(8)->letters()->mixedCase()->numbers()->symbols(),
            ],
            'rol'      => ['sometimes', 'string', 'in:admin,suport'],
            'actiu'    => ['sometimes', 'boolean'],
        ];
    }

    public function messages(): array
    {
        return [
            'nom.not_regex'     => 'El nombre no puede contener números.',
            'cognoms.not_regex' => 'Los apellidos no pueden contener números.',
        ];
    }
}
