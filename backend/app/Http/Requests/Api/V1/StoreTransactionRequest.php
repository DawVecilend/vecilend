<?php

namespace App\Http\Requests\Api\V1;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class StoreTransactionRequest extends FormRequest {
    public function authorize(): bool {
        return Auth::check();
    }

    public function rules(): array {
        return [
            'objecte_id' => ['required', 'integer', 'exists:objectes,id'],
            'data_inici' => ['required', 'date', 'after_or_equal:today'],
            'data_fi'    => ['required', 'date', 'after_or_equal:data_inici'],
            'missatge'   => ['nullable', 'string', 'max:1000'],
        ];
    }

    public function messages(): array {
        return [
            'objecte_id.required'      => 'Debes indicar el objeto que quieres solicitar.',
            'objecte_id.exists'        => 'El objeto indicado no existe.',
            'data_inici.required'      => 'La fecha de inicio es obligatoria.',
            'data_inici.after_or_equal' => 'La fecha de inicio no puede ser anterior a hoy.',
            'data_fi.required'         => 'La fecha de fin es obligatoria.',
            'data_fi.after_or_equal'   => 'La fecha de fin debe ser posterior o igual a la fecha de inicio.',
            'tipus.required'           => 'Debes indicar el tipo (préstamo o alquiler).',
            'tipus.in'                 => 'El tipo debe ser "prestec" o "lloguer".',
            'missatge.max'             => 'El mensaje no puede superar los 1000 caracteres.',
        ];
    }
}
