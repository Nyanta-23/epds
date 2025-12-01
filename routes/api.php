<?php

use App\Http\Controllers\Api\AiController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\BabyController;
use App\Http\Controllers\Api\PatientController;
use App\Http\Controllers\Api\PostpartumVisitAnswerController;
use App\Http\Controllers\Api\QuestionController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\PostpartumVisitController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;


Route::prefix('v1')->group(function () {

    Route::prefix('auth')->group(function () {
        Route::post('/login', [AuthController::class, 'login']);
        Route::post('/register', [AuthController::class, 'register']);
        Route::middleware('auth:sanctum')->post('/logout', [AuthController::class, 'logout']);
    });

    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/user', function (Request $request) {
            return $request->user();
        });

        Route::prefix('user')->group(function() {
            Route::put('/{id}/change-email', [UserController::class, 'changeEmail']);
        });

        Route::prefix('question')->group(function() {
            Route::get('/', [QuestionController::class, 'index']);
        });

        Route::prefix('patient')->group(function () {
            Route::put('/{id}', [PatientController::class, 'update']);
            Route::get('/{id?}', [PatientController::class, 'show']);
            Route::get('/{id?}/postpartum', [PatientController::class, 'getPostpartumChart']);
        });

        Route::prefix('baby')->group(function () {
            Route::post('/', [BabyController::class, 'store']);
            Route::get('/{id?}', [BabyController::class, 'find']);
            Route::put('/{id?}', [BabyController::class, 'update']);
            Route::delete('/{id?}', [BabyController::class, 'destroy']);
        });


        Route::prefix('postpartum')->group(function () {
            Route::get('/', [PostpartumVisitController::class, 'previousPostpartumVisit']);
            Route::post('/answer', [PostpartumVisitAnswerController::class, 'store']);
        });

    });
});
