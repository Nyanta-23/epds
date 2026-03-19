<?php

use App\Http\Controllers\Api\AiController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\BabyController;
use App\Http\Controllers\Api\FcmTokenController;
use App\Http\Controllers\Api\PatientController;
use App\Http\Controllers\Api\PostpartumController;
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

    Route::prefix('user')->group(function () {
      Route::put('/{id}/change-email', [UserController::class, 'changeEmail']);
      Route::put('/{id}/change-password', [UserController::class, 'changePassword']);
    });

    Route::prefix('question')->group(function () {
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
      Route::get('/{motherId}/schedule', [PostpartumController::class, 'getSchedule']);
      Route::get('/', [PostpartumVisitController::class, 'previousPostpartumVisit']);
      Route::post('/answer', [PostpartumVisitAnswerController::class, 'store']);
    });

    // FCM device token registration
    Route::post('/fcm-token', [FcmTokenController::class, 'store']);
    Route::delete('/fcm-token', [FcmTokenController::class, 'destroy']);

    // Notifications
    Route::prefix('notifications')->group(function () {
      Route::get('/', function (Request $request) {
        return response()->json([
          'unread' => $request->user()->unreadNotifications()->count(),
          'notifications' => $request->user()->unreadNotifications()
            ->orderByDesc('created_at')
            ->take(10)
            ->get(),
        ]);
      });

      Route::post('/{id}/read', function (Request $request, $id) {
        $notification = $request->user()->notifications()
          ->where('id', $id)
          ->first();

        if ($notification) {
          $notification->markAsRead();
        }

        return response()->json(['ok' => true]);
      });
    });

  });
});
