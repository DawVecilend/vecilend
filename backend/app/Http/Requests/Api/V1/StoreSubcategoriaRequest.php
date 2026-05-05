<?php

namespace App\Http\Requests\Api\V1;

use Illuminate\Foundation\Http\FormRequest;

class StoreSubcategoriaRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        if ($this->has('activa')) {
            $this->merge([
                'activa' => filter_var($this->input('activa'), FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE),
            ]);
        }
    }

    public function rules(): array
    {
        return [
            'categoria_id' => ['required', 'integer', 'exists:categories,id'],
            'nom' => ['required', 'string', 'max:100'],
            'descripcio' => ['nullable', 'string', 'max:1000'],
            'activa' => ['nullable', 'boolean'],
        ];
    }
}