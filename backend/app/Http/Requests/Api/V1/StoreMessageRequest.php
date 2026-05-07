<?php

namespace App\Http\Requests\Api\V1;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class StoreMessageRequest extends FormRequest
{
    public function authorize(): bool
    {
        return Auth::check();
    }

    public function rules(): array
    {
        return [
            'contingut' => ['required', 'string', 'max:2000'],
        ];
    }

    public function messages(): array
    {
        return [
            'contingut.required' => 'El missatge no pot estar buit.',
            'contingut.max'      => 'El missatge no pot superar els 2000 caràcters.',
        ];
    }
}
