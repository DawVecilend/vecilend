<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\StoreReportRequest;
use App\Http\Resources\ReportResource;
use App\Models\Report;
use Illuminate\Http\Response;

class ReportController extends Controller
{
    public function store(StoreReportRequest $request)
    {
        $data = $request->validated();
        $data['reportador_id'] = $request->user()->id;
        $data['estat']         = Report::ESTAT_PENDENT;

        $report = Report::create($data);
        $report->load(['reportador', 'usuariReportat', 'objecte']);

        return (new ReportResource($report))
            ->response()
            ->setStatusCode(Response::HTTP_CREATED);
    }
}
