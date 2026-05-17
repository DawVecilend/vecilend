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
            'puntuacio.required' => 'La puntuación es obligatoria.',
            'puntuacio.integer'  => 'La puntuación debe ser un número entero del 1 al 5.',
            'puntuacio.between'  => 'La puntuación debe estar entre 1 y 5.',
            'comentari.max'      => 'El comentario no puede superar los 1000 caracteres.',
        ];
    }
}
