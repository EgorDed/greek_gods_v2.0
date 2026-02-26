<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\EdgeController;
use App\Http\Controllers\Api\NodeController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::post('login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('logout', [AuthController::class, 'logout']);

    Route::post('admin/nodes', [NodeController::class, 'store']);
    Route::put('admin/nodes/{node}', [NodeController::class, 'update']);
    Route::delete('admin/nodes/{node}', [NodeController::class, 'destroy']);

    Route::post('admin/edges', [EdgeController::class, 'store']);
    Route::put('admin/edges/{edge}', [EdgeController::class, 'update']);
    Route::delete('admin/edges/{edge}', [EdgeController::class, 'destroy']);
});

// Публично только чтение
Route::apiResource('nodes', NodeController::class)->only(['index', 'show']);
Route::get('graph', [NodeController::class, 'graph']);
Route::apiResource('edges', EdgeController::class)->only(['index', 'show']);
