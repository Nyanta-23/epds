<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {
    // Auth Routes
    Route::post('/login', [\App\Http\Controllers\Api\AuthController::class, 'login']);
    Route::post('/register', [\App\Http\Controllers\Api\AuthController::class, 'register']);

    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/logout', [\App\Http\Controllers\Api\AuthController::class, 'logout']);
        Route::get('/user', function (Request $request) {
            return $request->user();
        });
        Route::put('/user/{id}/change-email', [\App\Http\Controllers\Api\UserController::class, 'changeEmail']);
        Route::put('/user/{id}/change-password', [\App\Http\Controllers\Api\UserController::class, 'changePassword']);

        // Patient / Profile Routes
        Route::get('/patient/{id?}', [\App\Http\Controllers\Api\PatientController::class, 'show']);
        Route::put('/patient/{id}', [\App\Http\Controllers\Api\PatientController::class, 'update']);
        Route::get('/patient/{id}/postpartum', [\App\Http\Controllers\Api\PatientController::class, 'getPostpartumChart']);
        Route::get('/patient/chart/{id?}', [\App\Http\Controllers\Api\PatientController::class, 'getPostpartumChart']); // Keep in case anything else relies on this alias

        // Baby Routes
        Route::post('/baby', [\App\Http\Controllers\Api\BabyController::class, 'store']);
        Route::get('/baby/{id}', [\App\Http\Controllers\Api\BabyController::class, 'find']);
        Route::put('/baby/{id}', [\App\Http\Controllers\Api\BabyController::class, 'update']);
        Route::delete('/baby/{id}', [\App\Http\Controllers\Api\BabyController::class, 'destroy']);

        // Midwife Routes
        Route::prefix('midwife')->group(function () {
            Route::get('/dashboard', [\App\Http\Controllers\Api\Midwife\DashboardController::class, 'index']);
            Route::get('/postpartum', [\App\Http\Controllers\Api\Midwife\PostpartumController::class, 'index']);
            Route::get('/postpartum/{id}', [\App\Http\Controllers\Api\Midwife\PostpartumController::class, 'show']);
            Route::post('/postpartum/{id}/followup', [\App\Http\Controllers\Api\Midwife\PostpartumController::class, 'storeFollowup']);
        });

        // Questionnaire / Postpartum Visit Routes
        Route::post('/postpartum-visit', [\App\Http\Controllers\Api\PostpartumVisitAnswerController::class, 'store']);
        Route::get('/questions', [\App\Http\Controllers\Api\QuestionController::class, 'index']);
        Route::get('/postpartum', [\App\Http\Controllers\Api\PostpartumController::class, 'previousPostpartumVisit']);
        Route::get('/postpartum/{id}/schedule', [\App\Http\Controllers\Api\PostpartumController::class, 'getSchedule']);
        // Notification Routes
        Route::get('/notifications', [\App\Http\Controllers\Api\NotificationController::class, 'index']);
        Route::post('/notifications/{id}/read', [\App\Http\Controllers\Api\NotificationController::class, 'markAsRead']);

        // FCM Token Routes
        Route::post('/fcm-token', [\App\Http\Controllers\Api\FcmTokenController::class, 'store']);
        Route::delete('/fcm-token', [\App\Http\Controllers\Api\FcmTokenController::class, 'destroy']);
    });
});
