<?php

namespace App\Http\Requests\Api\V1;

use App\Models\Objecte;
use App\Models\Subcategoria;
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
            'descripcio'    => ['sometimes', 'string', 'min:10', 'max:5000'],
            'categoria_id'  => ['sometimes', 'integer', 'exists:categories,id'],
            'subcategoria_id' => [
                'sometimes',
                'integer',
                'exists:subcategories,id',
                function ($attribute, $value, $fail) {
                    // Si arriba també una nova categoria_id, agafem aquesta;
                    // si no, mirem la categoria actual de l'objecte (route param 'id').
                    $categoriaId = $this->input('categoria_id')
                        ?? optional(Objecte::find($this->route('id')))->categoria_id;

                    if (!$categoriaId) {
                        return; // res a comparar
                    }

                    $pertany = Subcategoria::where('id', $value)
                        ->where('categoria_id', $categoriaId)
                        ->exists();

                    if (!$pertany) {
                        $fail('La subcategoria no pertany a la categoria seleccionada.');
                    }
                },
            ],
            'tipus'         => ['sometimes', 'string', 'in:prestec,lloguer'],
            'preu_diari'    => ['nullable', 'numeric', 'min:0', 'max:99999.99'],
            'estat'         => ['sometimes', 'string', 'in:disponible,no_disponible'],
            'lat'           => ['sometimes', 'numeric', 'between:-90,90'],
            'lng'           => ['sometimes', 'numeric', 'between:-180,180'],

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
            'descripcio.min'            => 'La descripció ha de tenir almenys 10 caràcters.',
            'categoria_id.exists'       => 'La categoria seleccionada no existeix.',
            'subcategoria_id.exists'    => 'La subcategoria seleccionada no existeix.',
            'tipus.in'                  => 'El tipus ha de ser: prestec o lloguer.',
            'estat.in'                  => 'L\'estat ha de ser: disponible o no_disponible.',
            'imatges_noves.*.image'     => 'Cada fitxer ha de ser una imatge.',
            'imatges_noves.*.mimes'     => 'Formats acceptats: JPEG, PNG, WebP.',
            'imatges_noves.*.max'       => 'Cada imatge no pot superar els 5 MB.',
            'imatges_eliminar.*.exists' => 'Una de les imatges a eliminar no existeix.',
        ];
    }
}
