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
      return $this->forbiddenResponse($request);
    }

    $userRole = $request->user()->role->slug ?? '';

    if (in_array($userRole, $roles)) {
      return $next($request);
    }

    return $this->forbiddenResponse($request);
  }

  /**
   * Return a 403 Inertia response so the React Forbidden page is rendered
   * instead of Laravel's default plain-text / JSON error response.
   */
  private function forbiddenResponse(Request $request): Response
  {
    if ($request->expectsJson()) {
      return response()->json(['message' => 'Anda tidak memiliki hak akses untuk halaman ini.'], 403);
    }

    return Inertia::render('errors/forbidden')
      ->toResponse($request)
      ->setStatusCode(403);
  }
}
