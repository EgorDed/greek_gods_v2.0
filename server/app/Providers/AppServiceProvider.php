<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Http\JsonResponse;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        //
    }

    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        //
        // Заставляем все JSON-ответы не экранировать Unicode
        JsonResponse::macro('utf8', function ($data = [], $status = 200, $headers = [], $options = 0) {
            $options |= JSON_UNESCAPED_UNICODE;
            return response()->json($data, $status, $headers, $options);
        });
    }
}
