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
    // Render custom Inertia 403 page for any AccessDenied / forbidden exception
    $exceptions->render(function (AccessDeniedHttpException $e, $request) {
      if ($request->expectsJson()) {
        return response()->json(['message' => $e->getMessage() ?: 'Forbidden'], 403);
      }

      return Inertia::render('errors/forbidden')
        ->toResponse($request)
        ->setStatusCode(403);
    });
  })->create();
