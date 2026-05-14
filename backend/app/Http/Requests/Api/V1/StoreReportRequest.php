<?php

namespace App\Http\Requests\Api\V1;

use App\Models\Report;
use Illuminate\Foundation\Http\FormRequest;

class StoreReportRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'usuari_reportat_id' => ['required', 'integer', 'exists:users,id'],
            'objecte_id'         => ['nullable', 'integer', 'exists:objectes,id'],
            'motiu'              => ['required', 'string', 'in:' . implode(',', Report::motiusDisponibles())],
            'descripcio'         => ['nullable', 'string', 'max:2000'],
        ];
    }

    public function messages(): array
    {
        return [
            'usuari_reportat_id.required' => 'Falta indicar el usuario reportado.',
            'usuari_reportat_id.exists'   => 'El usuario reportado no existe.',
            'objecte_id.exists'           => 'El objeto referenciado no existe.',
            'motiu.required'              => 'Debes seleccionar un motivo.',
            'motiu.in'                    => 'El motivo seleccionado no es válido.',
        ];
    }

    public function withValidator($validator): void
    {
        $validator->after(function ($v) {
            if ($this->input('motiu') === 'objecte_inapropiat' && !$this->filled('objecte_id')) {
                $v->errors()->add('objecte_id', 'Debes indicar a qué objeto se refiere el reporte.');
            }
            if ($this->user() && (int)$this->input('usuari_reportat_id') === (int)$this->user()->id) {
                $v->errors()->add('usuari_reportat_id', 'No puedes reportarte a ti mismo.');
            }
        });
    }
}
