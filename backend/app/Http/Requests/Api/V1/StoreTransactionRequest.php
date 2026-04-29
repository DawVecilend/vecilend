<?php

namespace App\Http\Requests\Api\V1;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class StoreTransactionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return Auth::check();
    }

    public function rules(): array
    {
        return [
            'objecte_id' => ['required', 'integer', 'exists:objectes,id'],
            'data_inici' => ['required', 'date', 'after_or_equal:today'],
            'data_fi'    => ['required', 'date', 'after_or_equal:data_inici'],
            'missatge'   => ['nullable', 'string', 'max:1000'],
        ];
    }

    public function messages(): array
    {
        return [
            'objecte_id.required'      => 'Has d\'indicar l\'objecte que vols sol·licitar.',
            'objecte_id.exists'        => 'L\'objecte indicat no existeix.',
            'data_inici.required'      => 'La data d\'inici és obligatòria.',
            'data_inici.after_or_equal' => 'La data d\'inici no pot ser anterior a avui.',
            'data_fi.required'         => 'La data de fi és obligatòria.',
            'data_fi.after_or_equal'   => 'La data de fi ha de ser posterior o igual a la data d\'inici.',
            'tipus.required'           => 'Has d\'indicar el tipus (préstec o lloguer).',
            'tipus.in'                 => 'El tipus ha de ser "prestec" o "lloguer".',
            'missatge.max'             => 'El missatge no pot superar els 1000 caràcters.',
        ];
    }
}
