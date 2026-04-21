<?php

namespace App\Http\Requests\Api\V1;

use Illuminate\Foundation\Http\FormRequest;

class UpdateObjecteRequest extends FormRequest
{
    public function authorize(): bool
    {
        // L'autorització la fa la Policy al controller (Gate::authorize)
        return true;
    }

    public function rules(): array
    {
        return [
            'nom'           => ['sometimes', 'string', 'max:200'],
            'descripcio'    => ['sometimes', 'string', 'max:5000'],
            'categoria_id'  => ['sometimes', 'integer', 'exists:categories,id'],
            'tipus'         => ['sometimes', 'string', 'in:prestec,lloguer,ambdos'],
            'preu_diari'    => ['nullable', 'numeric', 'min:0', 'max:99999.99'],
            'estat'         => ['sometimes', 'string', 'in:disponible,no_disponible'],
            'lat'           => ['sometimes', 'numeric', 'between:-90,90'],
            'lng'           => ['sometimes', 'numeric', 'between:-180,180'],

            // Subcategories: reemplaça les existents
            'subcategories'   => ['nullable', 'array', 'max:5'],
            'subcategories.*' => ['integer', 'exists:subcategories,id'],

            // Noves imatges (afegir)
            'imatges_noves'   => ['nullable', 'array', 'max:5'],
            'imatges_noves.*' => ['image', 'mimes:jpeg,png,webp', 'max:5120'],

            // IDs d'imatges a eliminar
            'imatges_eliminar'   => ['nullable', 'array'],
            'imatges_eliminar.*' => ['integer', 'exists:imatges_objecte,id'],
        ];
    }

    public function messages(): array
    {
        return [
            'nom.max'                   => 'El nom no pot superar els 200 caràcters.',
            'categoria_id.exists'       => 'La categoria seleccionada no existeix.',
            'tipus.in'                  => 'El tipus ha de ser: prestec, lloguer o ambdos.',
            'estat.in'                  => 'L\'estat ha de ser: disponible o no_disponible.',
            'imatges_noves.*.image'     => 'Cada fitxer ha de ser una imatge.',
            'imatges_noves.*.mimes'     => 'Formats acceptats: JPEG, PNG, WebP.',
            'imatges_noves.*.max'       => 'Cada imatge no pot superar els 5 MB.',
            'imatges_eliminar.*.exists' => 'Una de les imatges a eliminar no existeix.',
        ];
    }
}
