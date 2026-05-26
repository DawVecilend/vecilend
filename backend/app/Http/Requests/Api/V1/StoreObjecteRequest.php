<?php

namespace App\Http\Requests\Api\V1;

use App\Http\Requests\Api\V1\Concerns\ValidatesSpainLocation;
use App\Models\Subcategoria;
use Illuminate\Foundation\Http\FormRequest;

class StoreObjecteRequest extends FormRequest
{
    use ValidatesSpainLocation;

    public function authorize(): bool
    {
        // Qualsevol usuari autenticat pot publicar
        return true;
    }

    public function withValidator($validator): void
    {
        $validator->after(function ($v) {
            $lat = $this->input('lat');
            $lng = $this->input('lng');
            if (is_numeric($lat) && is_numeric($lng) && !self::isInSpain((float)$lat, (float)$lng)) {
                $v->errors()->add('lat', 'La ubicación debe estar dentro o cerca del territorio español.');
            }
        });
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
                        $fail('La subcategoría no pertenece a la categoría seleccionada.');
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
            'nom.required'             => 'El nombre del objeto es obligatorio.',
            'nom.max'                  => 'El nombre no puede superar los 200 caracteres.',
            'descripcio.required'      => 'La descripción es obligatoria.',
            'descripcio.min'           => 'La descripción debe tener al menos 10 caracteres.',
            'categoria_id.required'    => 'Debes seleccionar una categoría.',
            'categoria_id.exists'      => 'La categoría seleccionada no existe.',
            'subcategoria_id.required' => 'Debes seleccionar una subcategoría.',
            'subcategoria_id.exists'   => 'La subcategoría seleccionada no existe.',
            'tipus.required'           => 'Debes indicar el tipo (préstamo o alquiler).',
            'tipus.in'                 => 'El tipo debe ser: préstamo o alquiler.',
            'preu_diari.numeric'       => 'El precio debe ser un número.',
            'preu_diari.min'           => 'El precio debe ser superior a 0.',
            'preu_diari.required_if'   => 'El precio es obligatorio para los objetos en alquiler.',
            'lat.required'             => 'La ubicación (latitud) es obligatoria.',
            'lng.required'             => 'La ubicación (longitud) es obligatoria.',
            'imatges.required'         => 'Debes añadir al menos una imagen.',
            'imatges.min'              => 'Debes añadir al menos una imagen.',
            'imatges.max'              => 'Máximo 5 imágenes por objeto.',
            'imatges.*.image'          => 'Cada archivo debe ser una imagen.',
            'imatges.*.mimes'          => 'Formatos aceptados: JPEG, PNG, WebP.',
            'imatges.*.max'            => 'Cada imagen no puede superar los 5 MB.',
        ];
    }
}
