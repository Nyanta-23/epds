<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\BabyController;
use App\Http\Controllers\Api\PatientController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::prefix('auth')->group(function () {
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/register', [AuthController::class, 'register']);
});

Route::prefix('patient')->group(function () {
    Route::put('/{id}', [PatientController::class, 'update']);
    Route::get('/{id?}', [PatientController::class, 'show']);
    Route::get('/{id?}/postpartum/chart', [PatientController::class, 'getPostpartumChart']);
})->middleware('auth:sanctum');

Route::prefix('baby')->group(function() {
    Route::post('/', [BabyController::class, 'store']);
    Route::get('/{id?}', [BabyController::class, 'find']);
    Route::put('/{id?}', [BabyController::class, 'update']);
})->middleware('auth:sanctum');
