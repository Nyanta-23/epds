<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\BabyController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\FollowUpController;
use App\Http\Controllers\PatientController;
use App\Http\Controllers\PostpartumVisitController;
use App\Http\Controllers\QuestionController;
use App\Http\Controllers\QuestionOptionController;
use App\Http\Controllers\RecomendationRuleController;
use App\Http\Controllers\RecomendationVariationController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\UserController;
use App\Http\Middleware\IsMidwife;
use App\Models\Result;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');

    Route::post('/logout', [AuthController::class, 'destroy'])->name('logout');

    Route::post('/notifications/read-all', function () {
        auth()->user()->unreadNotifications->markAsRead();
        return back();
    })->name('notifications.readAll');

    Route::post('/notifications/{id}/read', function ($id) {
        auth()->user()->notifications()->where('id', $id)->first()?->markAsRead();
        return back();
    })->name('notifications.read');


    Route::prefix('user')->group(function () {
        Route::get('/', [UserController::class, 'index'])->name('user');
        Route::get('/create', [UserController::class, 'create'])->name('user.create');
        Route::get('/{user}/edit', [UserController::class, 'edit'])->name('user.edit');
        Route::post('/', [UserController::class, 'store'])->name('user.store');
        Route::put('/{user}', [UserController::class, 'update'])->name('user.update');
        Route::delete('/{user}', [UserController::class, 'destroy'])->name('user.destroy');
    });


    Route::prefix('question')->group(function () {
        Route::get('/', [QuestionController::class, 'index'])->name('question');
        Route::get('/{question}/edit', [QuestionController::class, 'edit'])->name('question.edit');
        Route::put('/{question}', [QuestionController::class, 'update'])->name('question.update');

        Route::prefix('option')->group(function () {
            Route::put('/{option}', [QuestionOptionController::class, 'update'])->name('question.option.update');
        });
    });

    Route::prefix('patient')->group(function () {
        Route::get('/', [PatientController::class, 'index'])->name('patient');
        Route::get('/{user}/edit', [PatientController::class, 'edit'])->name('patient.edit');
        Route::get('/{user}', [PatientController::class, 'show'])->name('patient.show');
        Route::put('/{user}', [PatientController::class, 'update'])->name('patient.update');

        Route::patch('/{user}/visit', [PatientController::class, 'visit'])->name('patient.visit');
        Route::patch('/{user}/verification', [PatientController::class, 'verification'])->name('patient.verification');
    });

    Route::prefix('baby')->group(function () {
        Route::get('/', [BabyController::class, 'index'])->name('baby');
        Route::get('/create', [BabyController::class, 'create'])->name('baby.create');
        Route::get('/{baby}/edit', [BabyController::class, 'edit'])->name('baby.edit');
        Route::get('/{baby}', [BabyController::class, 'show'])->name('baby.show');
        Route::post('/', [BabyController::class, 'store'])->name('baby.store');
        Route::put('/{baby}', [BabyController::class, 'update'])->name('baby.update');
        Route::delete('/{baby}', [BabyController::class, 'destroy'])->name('baby.destroy');
    });

    Route::prefix('postpartum')->group(function () {
        Route::get('/', [PostpartumVisitController::class, 'index'])->name('postpartum');
        Route::get('/{postpartum}', [PostpartumVisitController::class, 'show'])->name('postpartum.show');
        Route::get('/{postpartum}/edit', [PostpartumVisitController::class, 'edit'])->name('postpartum.edit');
        Route::put('/{postpartum}', [PostpartumVisitController::class, 'update'])->name('postpartum.update');
    });

    Route::prefix('followup')->group(function () {
        Route::post('/{postpartum}', [FollowUpController::class, 'store'])->name('followup.store');
        Route::put('/{followup}', [FollowUpController::class, 'update'])->name('followup.update');
    });

    Route::prefix('recomendation')->group(function () {

        Route::prefix('variation')->group(function () {
            Route::get('/', [RecomendationVariationController::class, 'index'])->name('variation');
        });

        Route::prefix('rule')->group(function () {
            Route::get('/', [RecomendationRuleController::class, 'index'])->name('rule');
            // Route::get('/create', [RecomendationRuleController::class, 'create'])->name('rule.create');
            Route::get('/{rule}/edit', [RecomendationRuleController::class, 'edit'])->name('rule.edit');
            Route::delete('/{rule}', [RecomendationRuleController::class, 'destroy'])->name('rule.destroy');
            Route::put('/{rule}', [RecomendationRuleController::class, 'update'])->name('rule.update');
            // Route::post('/', [RecomendationRuleController::class, 'store'])->name('rule.store');
        });
    });


    Route::prefix('role')->group(function () {
        Route::get('/', [RoleController::class, 'index'])->name('role');
    })->middleware([IsMidwife::class]);
});

Route::get('/email/verify/{id}/{hash}', [AuthController::class, 'verify'])
    ->middleware(['signed', 'throttle:6,1'])
    ->name('verification.verify');



require __DIR__ . '/settings.php';
