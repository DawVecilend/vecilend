<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\AdminLogResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AdminLogController extends Controller
{
    public function index(Request $request)
    {
        $query = DB::table('logs')
            ->leftJoin('users', 'logs.user_id', '=', 'users.id')
            ->leftJoin('empleats', 'logs.empleat_id', '=', 'empleats.id')
            ->orderByDesc('logs.created_at')
            ->select([
                'logs.id',
                'logs.user_id',
                'users.username as user_username',
                'users.email as user_email',
                'logs.empleat_id',
                'empleats.username as empleat_username',
                'empleats.email as empleat_email',
                'empleats.rol as empleat_rol',
                'logs.tipus',
                'logs.accio',
                'logs.detall',
                'logs.entitat_afectada',
                'logs.id_entitat_afectada',
                'logs.ip',
                'logs.created_at',
            ]);

        if ($request->filled('tipus')) {
            $query->where('logs.tipus', $request->input('tipus'));
        }

        $logs = $query->get();

        return AdminLogResource::collection($logs);
    }
}
