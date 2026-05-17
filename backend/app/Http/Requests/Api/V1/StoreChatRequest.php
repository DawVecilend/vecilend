<?php

namespace App\Http\Requests\Api\V1;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class StoreChatRequest extends FormRequest
{
    public function authorize(): bool
    {
        return Auth::check();
    }

    public function rules(): array
    {
        return [
            'user_id'    => ['required', 'integer', 'exists:users,id', 'different:' . Auth::id()],
            'objecte_id' => ['nullable', 'integer', 'exists:objectes,id'],
            'missatge'   => ['nullable', 'string', 'max:2000'],
        ];
    }

    public function messages(): array
    {
        return [
            'user_id.required'  => 'Debes indicar con quién quieres abrir la conversación.',
            'user_id.exists'    => 'El usuario indicado no existe.',
            'user_id.different' => 'No puedes iniciar una conversación contigo mismo.',
            'objecte_id.exists' => 'El objeto indicado no existe.',
            'missatge.max'      => 'El mensaje no puede superar los 2000 caracteres.',
        ];
    }
}
