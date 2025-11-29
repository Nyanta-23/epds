<?php

use App\Http\Controllers\Api\AiController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\BabyController;
use App\Http\Controllers\Api\PatientController;
use App\Http\Controllers\Api\PostpartumVisitAnswerController;
use App\Http\Controllers\PostpartumVisitController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;


Route::prefix('v1')->group(function () {

    Route::get('/', function (Request $request) {
        return response()->json([
            'message' => 'Hello Everynyan'
        ]);
    });

    Route::get('/test', function (Request $request) {
        return response()->json([
            'message' => 'Hello Auothed Nyan'
        ]);
    })->middleware('auth:sanctum');

    Route::prefix('auth')->group(function () {
        Route::post('/login', [AuthController::class, 'login']);
        Route::post('/register', [AuthController::class, 'register']);
        Route::middleware('auth:sanctum')->post('/logout', [AuthController::class, 'logout']);
    });

    Route::middleware('auth:sanctum')->group(function () {

        Route::get('/user', function (Request $request) {
            return $request->user();
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
        });


        Route::prefix('postpartum')->group(function () {
            Route::get('/', [PostpartumVisitController::class, 'previousPostpartumVisit']);
            Route::post('/answer', [PostpartumVisitAnswerController::class, 'store']);

            // Route::post('/answer', function () {
            //     lad('asd');
            // });
        });

        Route::prefix('ai')->group(function () {
            Route::get('/test', [AiController::class, 'test']);
        });

    });
});
