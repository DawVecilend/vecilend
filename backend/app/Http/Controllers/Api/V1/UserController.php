<?php
namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller {
    public function getByUsername($username) {
        $user = User::where('username', $username)->first();
        if (!$user) {
            return response()->json([
                'message' => 'Usuari no trobat.',
            ], 404);
        }

        return new UserResource($user);
    }
}