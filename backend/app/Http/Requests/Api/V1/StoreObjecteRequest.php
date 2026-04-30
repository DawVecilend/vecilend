<?php

namespace App\Http\Requests\Api\V1;

use App\Models\Subcategoria;
use Illuminate\Foundation\Http\FormRequest;

class StoreObjecteRequest extends FormRequest
{
    public function authorize(): bool
    {
        // Qualsevol usuari autenticat pot publicar
        return true;
    }

    /**
     * Normalitza els camps abans de validar:
     *   - Si tipus = prestec, forcem preu_diari a null (un préstec mai té preu).
     */
    protected function prepareForValidation(): void
    {
        if ($this->input('tipus') === 'prestec') {
            $this->merge(['preu_diari' => null]);
        }
    }

    public function rules(): array
    {
        return [
            'nom'           => ['required', 'string', 'max:200'],
            'descripcio'    => ['required', 'string', 'min:10', 'max:5000'],
            'categoria_id'  => ['required', 'integer', 'exists:categories,id'],
            'subcategoria_id' => [
                'required',
                'integer',
                'exists:subcategories,id',
                function ($attribute, $value, $fail) {
                    $pertany = Subcategoria::where('id', $value)
                        ->where('categoria_id', $this->input('categoria_id'))
                        ->exists();
                    if (!$pertany) {
                        $fail('La subcategoria no pertany a la categoria seleccionada.');
                    }
                },
            ],
            'tipus'         => ['required', 'string', 'in:prestec,lloguer'],

            // Si és lloguer, preu_diari obligatori i > 0.
            // Si és préstec, ja l'hem forçat a null al prepareForValidation.
            'preu_diari'    => [
                'nullable',
                'numeric',
                'min:1.00',
                'max:99999.99',
                'required_if:tipus,lloguer',
            ],

            'lat'           => ['required', 'numeric', 'between:-90,90'],
            'lng'           => ['required', 'numeric', 'between:-180,180'],

            // Imatges: mínim 1, màxim 5
            'imatges'   => ['required', 'array', 'min:1', 'max:5'],
            'imatges.*' => ['image', 'mimes:jpeg,png,webp', 'max:5120'], // 5 MB cadascuna
        ];
    }

    public function messages(): array
    {
        return [
            'nom.required'             => 'El nom de l\'objecte és obligatori.',
            'nom.max'                  => 'El nom no pot superar els 200 caràcters.',
            'descripcio.required'      => 'La descripció és obligatòria.',
            'descripcio.min'           => 'La descripció ha de tenir almenys 10 caràcters.',
            'categoria_id.required'    => 'Has de seleccionar una categoria.',
            'categoria_id.exists'      => 'La categoria seleccionada no existeix.',
            'subcategoria_id.required' => 'Has de seleccionar una subcategoria.',
            'subcategoria_id.exists'   => 'La subcategoria seleccionada no existeix.',
            'tipus.required'           => 'Has d\'indicar el tipus (préstec o lloguer).',
            'tipus.in'                 => 'El tipus ha de ser: préstec o lloguer.',
            'preu_diari.numeric'       => 'El preu ha de ser un número.',
            'preu_diari.min'           => 'El preu ha de ser superior a 0.',
            'preu_diari.required_if'   => 'El preu és obligatori per als objectes en lloguer.',
            'lat.required'             => 'La ubicació (latitud) és obligatòria.',
            'lng.required'             => 'La ubicació (longitud) és obligatòria.',
            'imatges.required'         => 'Has de pujar almenys una imatge.',
            'imatges.min'              => 'Has de pujar almenys una imatge.',
            'imatges.max'              => 'Màxim 5 imatges per objecte.',
            'imatges.*.image'          => 'Cada fitxer ha de ser una imatge.',
            'imatges.*.mimes'          => 'Formats acceptats: JPEG, PNG, WebP.',
            'imatges.*.max'            => 'Cada imatge no pot superar els 5 MB.',
        ];
    }
}
