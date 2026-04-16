<?php

namespace App\Http\Requests\Api\V1;

use Illuminate\Foundation\Http\FormRequest;

class StoreObjecteRequest extends FormRequest
{
    public function authorize(): bool
    {
        // Qualsevol usuari autenticat pot publicar
        return true;
    }

    public function rules(): array
    {
        return [
            'nom'           => ['required', 'string', 'max:200'],
            'descripcio'    => ['required', 'string', 'max:5000'],
            'categoria_id'  => ['required', 'integer', 'exists:categories,id'],
            'tipus'         => ['required', 'string', 'in:prestec,lloguer,ambdos'],
            'preu_diari'    => ['nullable', 'numeric', 'min:0', 'max:99999.99'],
            'lat'           => ['required', 'numeric', 'between:-90,90'],
            'lng'           => ['required', 'numeric', 'between:-180,180'],

            // Subcategories opcionals (array d'IDs)
            'subcategories'   => ['nullable', 'array', 'max:5'],
            'subcategories.*' => ['integer', 'exists:subcategories,id'],

            // Imatges: mínim 1, màxim 5
            'imatges'   => ['required', 'array', 'min:1', 'max:5'],
            'imatges.*' => ['image', 'mimes:jpeg,png,webp', 'max:5120'], // 5 MB cadascuna
        ];
    }

    public function messages(): array
    {
        return [
            'nom.required'          => 'El nom de l\'objecte és obligatori.',
            'nom.max'               => 'El nom no pot superar els 200 caràcters.',
            'descripcio.required'   => 'La descripció és obligatòria.',
            'categoria_id.required' => 'Has de seleccionar una categoria.',
            'categoria_id.exists'   => 'La categoria seleccionada no existeix.',
            'tipus.required'        => 'Has d\'indicar el tipus (préstec, lloguer o ambdós).',
            'tipus.in'              => 'El tipus ha de ser: prestec, lloguer o ambdos.',
            'preu_diari.numeric'    => 'El preu ha de ser un número.',
            'lat.required'          => 'La ubicació (latitud) és obligatòria.',
            'lng.required'          => 'La ubicació (longitud) és obligatòria.',
            'imatges.required'      => 'Has de pujar almenys una imatge.',
            'imatges.min'           => 'Has de pujar almenys una imatge.',
            'imatges.max'           => 'Màxim 5 imatges per objecte.',
            'imatges.*.image'       => 'Cada fitxer ha de ser una imatge.',
            'imatges.*.mimes'       => 'Formats acceptats: JPEG, PNG, WebP.',
            'imatges.*.max'         => 'Cada imatge no pot superar els 5 MB.',
        ];
    }
}
