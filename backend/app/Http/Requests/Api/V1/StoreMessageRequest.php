<?php

namespace App\Http\Requests\Api\V1;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class StoreMessageRequest extends FormRequest
{
    public function authorize(): bool
    {
        return Auth::check();
    }

    public function rules(): array
    {
        return [
            'contingut'   => ['required', 'string', 'max:2000'],
            'objecte_id'  => ['nullable', 'integer', 'exists:objectes,id'],
            'respon_a_id' => [
                'nullable',
                'integer',
                'exists:missatges,id',
                // Garantim que el missatge citat pertany a la mateixa conversa
                function ($attribute, $value, $fail) {
                    if (!$value) return;

                    $conversaIdRoute = $this->route('id');
                    $missatge = \App\Models\Missatge::find($value);
                    if (!$missatge) {
                        $fail('El mensaje citado no existe.');
                        return;
                    }
                    if ((int) $missatge->conversa_id !== (int) $conversaIdRoute) {
                        $fail('No puedes citar un mensaje de otra conversación.');
                    }
                },
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'contingut.required' => 'El mensaje no puede estar vacío.',
            'contingut.max'      => 'El mensaje no puede superar los 2000 caracteres.',
        ];
    }
}
