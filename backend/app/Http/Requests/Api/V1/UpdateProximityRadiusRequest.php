<?php

namespace App\Http\Requests\Api\V1;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class UpdateProximityRadiusRequest extends FormRequest
{
    public function authorize(): bool
    {
        return Auth::check();
    }

    public function rules(): array
    {
        return [
            'radi_proximitat' => ['required', 'integer', 'between:1,50'],
        ];
    }

    public function messages(): array
    {
        return [
            'radi_proximitat.required' => 'El radi de proximitat és obligatori.',
            'radi_proximitat.integer'  => 'El radi ha de ser un nombre enter.',
            'radi_proximitat.between'  => 'El radi de proximitat ha d\'estar entre 1 i 50 km.',
        ];
    }
}
