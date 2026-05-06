<?php

namespace App\Http\Requests\Api\V1;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class StoreValoracioRequest extends FormRequest
{
    public function authorize(): bool
    {
        return Auth::check();
    }

    public function rules(): array
    {
        return [
            'puntuacio' => ['required', 'integer', 'between:1,5'],
            'comentari' => ['nullable', 'string', 'max:1000'],
        ];
    }

    public function messages(): array
    {
        return [
            'puntuacio.required' => 'La puntuació és obligatòria.',
            'puntuacio.integer'  => 'La puntuació ha de ser un enter d\'1 a 5.',
            'puntuacio.between'  => 'La puntuació ha d\'estar entre 1 i 5.',
            'comentari.max'      => 'El comentari no pot superar els 1000 caràcters.',
        ];
    }
}
