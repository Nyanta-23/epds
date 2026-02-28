<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\Response;

class CheckRole
{
  /**
   * Handle an incoming request.
   *
   * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
   */
  public function handle(Request $request, Closure $next, ...$roles): Response
  {
    if (!$request->user()) {
      return Inertia::render('errors/forbidden')
        ->toResponse($request)
        ->setStatusCode(403);
    }

    $userRole = $request->user()->role->slug ?? '';

    if (in_array($userRole, $roles)) {
      return $next($request);
    }

    return Inertia::render('errors/forbidden')
      ->toResponse($request)
      ->setStatusCode(403);
  }
}
