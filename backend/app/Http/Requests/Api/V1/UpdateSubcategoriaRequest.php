<?php

namespace App\Http\Requests\Api\V1;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateSubcategoriaRequest extends FormRequest
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
        $subcategoryId = $this->route('id');

        return [
            'categoria_id' => ['nullable', 'integer', 'exists:categories,id'],
            'nom' => ['required', 'string', 'max:100'],
            'descripcio' => ['nullable', 'string', 'max:1000'],
            'activa' => ['nullable', 'boolean'],
        ];
    }
}