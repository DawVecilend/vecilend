<?php

namespace App\Http\Controllers\Api\V1\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\UpdatePasswordRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Hash;

class PasswordController extends Controller {
    public function update(UpdatePasswordRequest $request): JsonResponse {
        $user = $request->user();

        $user->update([
            'password' => Hash::make($request->validated('password'))
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Contraseña actualizada correctamente.'
        ], 200);
    }
}