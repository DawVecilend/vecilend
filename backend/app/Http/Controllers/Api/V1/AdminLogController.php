<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\AdminLogResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AdminLogController extends Controller
{
    public function index(Request $request)
    {
        $logs = DB::table('logs')
            ->leftJoin('users', 'logs.user_id', '=', 'users.id')
            ->where('logs.tipus', 'admin')
            ->orderByDesc('logs.created_at')
            ->select([
                'logs.id',
                'logs.user_id',
                'users.username as user_username',
                'users.email as user_email',
                'logs.tipus',
                'logs.accio',
                'logs.detall',
                'logs.entitat_afectada',
                'logs.id_entitat_afectada',
                'logs.ip',
                'logs.created_at',
            ])
            ->get();

        return AdminLogResource::collection($logs);
    }
}
