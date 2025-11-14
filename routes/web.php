<?php

use App\Http\Controllers\BabyController;
use App\Http\Controllers\MidwifeController;
use App\Http\Controllers\PatientController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::prefix('user')->group(function () {
        Route::get('/', [UserController::class, 'index'])->name('user');
        Route::get('/create', [UserController::class, 'create'])->name('user.create');
        Route::get('/{user}/edit', [UserController::class, 'edit'])->name('user.edit');
        Route::post('/', [UserController::class, 'store'])->name('user.store');
        Route::put('/{user}', [UserController::class, 'update'])->name('user.update');
        Route::delete('/{user}', [UserController::class, 'destroy'])->name('user.destroy');
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
        Route::get('{baby}/edit', [BabyController::class, 'edit'])->name('baby.edit');
        Route::get('/{baby}', [BabyController::class, 'show'])->name('baby.show');
        Route::post('/', [BabyController::class, 'store'])->name('baby.store');
        Route::put('/{baby}', [BabyController::class, 'update'])->name('baby.update');
        Route::delete('/{baby}', [BabyController::class, 'destroy'])->name('baby.destroy');
    });
});





require __DIR__ . '/settings.php';
