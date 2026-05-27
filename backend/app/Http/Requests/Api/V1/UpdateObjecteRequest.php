<?php

namespace App\Http\Requests\Api\V1;

use App\Http\Requests\Api\V1\Concerns\ValidatesSpainLocation;
use App\Models\Objecte;
use App\Models\Subcategoria;
use Illuminate\Foundation\Http\FormRequest;

class UpdateObjecteRequest extends FormRequest
{
    use ValidatesSpainLocation;

    public function authorize(): bool
    {
        // L'autorització la fa la Policy al controller (Gate::authorize)
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
     *   - Si l'usuari canvia tipus a 'prestec', forcem preu_diari a null.
     *   - Si NO envia tipus però envia preu i l'objecte actual és préstec,
     *     també forcem null (un préstec no pot tenir preu, mai).
     */
    protected function prepareForValidation(): void
    {
        $tipusEnviat = $this->input('tipus');

        // Cas 1: l'usuari està canviant explícitament el tipus a préstec
        if ($tipusEnviat === 'prestec') {
            $this->merge(['preu_diari' => null]);
            return;
        }

        // Cas 2: no canvia el tipus però intenta posar preu;
        // mirem el tipus actual de l'objecte a la BD.
        if (!$tipusEnviat && $this->has('preu_diari')) {
            $objecte = Objecte::find($this->route('id'));
            if ($objecte && $objecte->tipus === 'prestec') {
                $this->merge(['preu_diari' => null]);
            }
        }
    }

    public function rules(): array
    {
        // Per resoldre el `required_if` correctament en un PUT/PATCH on `tipus`
        // potser no s'envia (i ens hem de basar en el tipus actual de l'objecte).
        $tipusFinal = $this->input('tipus')
            ?? optional(Objecte::find($this->route('id')))->tipus;

        return [
            'nom'           => ['sometimes', 'string', 'max:200'],
            'descripcio'    => ['sometimes', 'string', 'min:10', 'max:5000'],
            'categoria_id'  => ['sometimes', 'integer', 'exists:categories,id'],
            'subcategoria_id' => [
                'sometimes',
                'integer',
                'exists:subcategories,id',
                function ($attribute, $value, $fail) {
                    $categoriaId = $this->input('categoria_id')
                        ?? optional(Objecte::find($this->route('id')))->categoria_id;
                    if (!$categoriaId) {
                        return;
                    }
                    $pertany = Subcategoria::where('id', $value)
                        ->where('categoria_id', $categoriaId)
                        ->exists();
                    if (!$pertany) {
                        $fail('La subcategoría no pertenece a la categoría seleccionada.');
                    }
                },
            ],
            'tipus' => ['sometimes', 'string', 'in:prestec,lloguer'],

            // Si el tipus final (enviat o existent) és lloguer, preu obligatori i ≥ 1€.
            // Si és préstec, ja l'hem forçat a null al prepareForValidation.
            'preu_diari' => [
                'nullable',
                'numeric',
                'min:1.00',
                'max:9999.99',
                'required_if:tipus,lloguer',
            ],

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
            'nom.max'                   => 'El nombre no puede superar los 200 caracteres.',
            'descripcio.min'            => 'La descripción debe tener al menos 10 caracteres.',
            'categoria_id.exists'       => 'La categoría seleccionada no existe.',
            'subcategoria_id.exists'    => 'La subcategoría seleccionada no existe.',
            'tipus.in'                  => 'El tipo debe ser: prestec o lloguer.',
            'estat.in'                  => 'El estado debe ser: disponible o no_disponible.',
            'preu_diari.required'       => 'El precio es obligatorio para los objetos en alquiler.',
            'preu_diari.min'            => 'El precio debe ser como mínimo 1€.',
            'preu_diari.numeric'        => 'El precio debe ser un número.',
            'imatges_noves.*.image'     => 'Cada archivo debe ser una imagen.',
            'imatges_noves.*.mimes'     => 'Formatos aceptados: JPEG, PNG, WebP.',
            'imatges_noves.*.max'       => 'Cada imagen no puede superar los 5 MB.',
            'imatges_eliminar.*.exists' => 'Una de las imágenes a eliminar no existe.',
        ];
    }
}
