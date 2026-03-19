<?php

use App\Http\Middleware\CheckRole;
use App\Http\Middleware\HandleAppearance;
use App\Http\Middleware\HandleInertiaRequests;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets;
use Inertia\Inertia;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;

return Application::configure(basePath: dirname(__DIR__))
  ->withRouting(
    web: __DIR__ . '/../routes/web.php',
    api: __DIR__ . '/../routes/api.php',
    commands: __DIR__ . '/../routes/console.php',
    health: '/up',
  )
  ->withMiddleware(function (Middleware $middleware) {
    $middleware->trustProxies(at: '*');
    $middleware->encryptCookies(except: ['appearance', 'sidebar_state']);
    $middleware->web(append: [
      HandleAppearance::class,
      HandleInertiaRequests::class,
      AddLinkHeadersForPreloadedAssets::class,
    ]);
    $middleware->alias([
      'role' => CheckRole::class
    ]);
  })
  ->withExceptions(function (Exceptions $exceptions) {
    // Tangkap semua 403 (abort(403) atau middleware) → halaman Forbidden Inertia
    $exceptions->render(function (AccessDeniedHttpException $e, $request) {
      if ($request->header('X-Inertia')) {
        return Inertia::render('errors/forbidden')
          ->toResponse($request)
          ->setStatusCode(403);
      }
    });
  })
  ->withSchedule(function ($schedule) {
    // Notify missed EPDS schedules daily at 07:00
    $schedule->command('notify:missed-epds')
      ->daily()
      ->at('07:00')
      ->onOneServer()
      ->withoutOverlapping();
  })
  ->create();
