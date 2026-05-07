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
            'user_id.required'  => "Has d'indicar amb qui vols obrir la conversa.",
            'user_id.exists'    => "L'usuari indicat no existeix.",
            'user_id.different' => 'No pots iniciar una conversa amb tu mateix.',
            'objecte_id.exists' => "L'objecte indicat no existeix.",
            'missatge.max'      => 'El missatge no pot superar els 2000 caràcters.',
        ];
    }
}
