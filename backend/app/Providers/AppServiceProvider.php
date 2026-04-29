<?php

namespace App\Providers;

use App\Models\Objecte;
use App\Models\Solicitud;
use App\Policies\ObjectePolicy;
use App\Policies\TransactionPolicy;
use App\Services\CloudinaryService;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->singleton(CloudinaryService::class);
    }

    public function boot(): void
    {
        Gate::policy(Objecte::class, ObjectePolicy::class);
        Gate::policy(Solicitud::class, TransactionPolicy::class);
    }
}
