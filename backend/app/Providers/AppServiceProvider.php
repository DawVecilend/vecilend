<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Gate;
use App\Models\Objecte;
use App\Policies\ObjectePolicy;
use App\Services\CloudinaryService;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->singleton(CloudinaryService::class);
    }

    public function boot(): void
    {
        Gate::policy(Objecte::class, ObjectePolicy::class);
    }
}
