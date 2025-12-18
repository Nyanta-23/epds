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
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

// --- PUBLIC ROUTES ---
Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

// Route Verifikasi Email (Harus Public/Signed Only, tapi di luar grup Auth standar)
Route::get('/email/verify/{id}/{hash}', [AuthController::class, 'verify'])
    ->middleware(['signed', 'throttle:6,1'])
    ->name('verification.verify');


// --- AUTHENTICATED ROUTES ---
Route::middleware(['auth', 'verified'])->group(function () {
    
    // 1. GLOBAL AUTH ROUTES (Semua User Login Bisa Akses)
    // ---------------------------------------------------
    Route::post('/logout', [AuthController::class, 'destroy'])->name('logout');

    // Notifikasi (Penting untuk semua role, terutama Bidan)
    Route::post('/notifications/read-all', function () {
        auth()->user()->unreadNotifications->markAsRead();
        return back();
    })->name('notifications.readAll');

    Route::post('/notifications/{id}/read', function ($id) {
        auth()->user()->notifications()->where('id', $id)->first()?->markAsRead();
        return back();
    })->name('notifications.read');


    // 2. DASHBOARD (Akses: Super Admin, Admin, Bidan)
    // ---------------------------------------------------
    Route::middleware(['role:super_admin,admin,midwife'])->group(function () {
        Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');
    });


    // 3. SYSTEM & CONFIGURATION (Akses: HANYA Super Admin)
    // ---------------------------------------------------
    Route::middleware(['role:super_admin'])->group(function () {
        
        // Manajemen Role
        Route::prefix('role')->group(function () {
            Route::get('/', [RoleController::class, 'index'])->name('role');
        });

        // Manajemen Kuesioner (Bidan TIDAK BOLEH edit soal)
        Route::prefix('question')->group(function () {
            Route::get('/', [QuestionController::class, 'index'])->name('question');
            Route::get('/{question}/edit', [QuestionController::class, 'edit'])->name('question.edit');
            Route::put('/{question}', [QuestionController::class, 'update'])->name('question.update');

            Route::prefix('option')->group(function () {
                Route::put('/{option}', [QuestionOptionController::class, 'update'])->name('question.option.update');
            });
        });

        // Manajemen Rule Rekomendasi
        Route::prefix('recomendation')->group(function () {
            Route::prefix('variation')->group(function () {
                Route::get('/', [RecomendationVariationController::class, 'index'])->name('variation');
            });

            Route::prefix('rule')->group(function () {
                Route::get('/', [RecomendationRuleController::class, 'index'])->name('rule');
                Route::get('/{rule}/edit', [RecomendationRuleController::class, 'edit'])->name('rule.edit');
                Route::delete('/{rule}', [RecomendationRuleController::class, 'destroy'])->name('rule.destroy');
                Route::put('/{rule}', [RecomendationRuleController::class, 'update'])->name('rule.update');
            });
        });
    });


    // 4. USER MANAGEMENT (Akses: Super Admin & Admin)
    // ---------------------------------------------------
    // Bidan tidak boleh membuat user baru.
    Route::middleware(['role:super_admin,admin'])->prefix('user')->group(function () {
        Route::get('/', [UserController::class, 'index'])->name('user');
        Route::get('/create', [UserController::class, 'create'])->name('user.create');
        Route::get('/{user}/edit', [UserController::class, 'edit'])->name('user.edit');
        Route::post('/', [UserController::class, 'store'])->name('user.store');
        Route::put('/{user}', [UserController::class, 'update'])->name('user.update');
        Route::delete('/{user}', [UserController::class, 'destroy'])->name('user.destroy');
    });


    // 5. OPERATIONAL / MEDIS (Akses: Super Admin, Admin, Bidan)
    // ---------------------------------------------------
    Route::middleware(['role:super_admin,admin,midwife'])->group(function () {

        // Manajemen Pasien (Ibu)
        Route::prefix('patient')->group(function () {
            Route::get('/', [PatientController::class, 'index'])->name('patient');
            Route::get('/{user}/edit', [PatientController::class, 'edit'])->name('patient.edit');
            Route::get('/{user}', [PatientController::class, 'show'])->name('patient.show');
            Route::put('/{user}', [PatientController::class, 'update'])->name('patient.update');
            
            // Aksi Khusus
            Route::patch('/{user}/visit', [PatientController::class, 'visit'])->name('patient.visit');
            Route::patch('/{user}/verification', [PatientController::class, 'verification'])->name('patient.verification');
        });

        // Manajemen Bayi
        Route::prefix('baby')->group(function () {
            Route::get('/', [BabyController::class, 'index'])->name('baby');
            Route::get('/create', [BabyController::class, 'create'])->name('baby.create');
            Route::get('/{baby}/edit', [BabyController::class, 'edit'])->name('baby.edit');
            Route::get('/{baby}', [BabyController::class, 'show'])->name('baby.show');
            Route::post('/', [BabyController::class, 'store'])->name('baby.store');
            Route::put('/{baby}', [BabyController::class, 'update'])->name('baby.update');
            Route::delete('/{baby}', [BabyController::class, 'destroy'])->name('baby.destroy');
        });

        // Hasil Skrining EPDS (Read/View)
        Route::prefix('postpartum')->group(function () {
            Route::get('/', [PostpartumVisitController::class, 'index'])->name('postpartum');
            Route::get('/{postpartum}', [PostpartumVisitController::class, 'show'])->name('postpartum.show');
            // Edit Skrining? Hati-hati, biasanya hasil medis tidak boleh diedit sembarangan.
            Route::get('/{postpartum}/edit', [PostpartumVisitController::class, 'edit'])->name('postpartum.edit');
            Route::put('/{postpartum}', [PostpartumVisitController::class, 'update'])->name('postpartum.update');
        });
    });


    // 6. TINDAK LANJUT MEDIS (Akses: KHUSUS Bidan & Super Admin)
    // ---------------------------------------------------
    // Admin (Tata Usaha) tidak boleh mengisi follow-up medis.
    Route::middleware(['role:super_admin,midwife'])->prefix('followup')->group(function () {
        Route::post('/{postpartum}', [FollowUpController::class, 'store'])->name('followup.store');
        Route::put('/{followup}', [FollowUpController::class, 'update'])->name('followup.update');
    });

});

require __DIR__ . '/settings.php';