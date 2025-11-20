<?php

namespace App\Http\Controllers\Api;

use App\DTO\Request\Auth\LoginRequestData;
use App\Http\Controllers\Controller;
use App\Http\Requests\api\LoginRequest;
use App\Service\Auth\AuthService;
use Exception;
use Log;

class AuthController extends Controller
{
  public function __construct(private AuthService $authService)
  {

  }

  public function login(LoginRequest $request)
  {
    $validated = $request->validated();

    Log::info('validated params', ['validated_params' => $validated]);

    try {
      $request = new LoginRequestData();
      $request->email = $validated['email'];
      $request->password = $validated['password'];

      $response = $this->authService->login($request);

      return response()->json([
        'message' => 'Login Berhasil',
        'data' => [
          'id' => $response->id,
          'email' => $response->email,
          'name' => $response->name,
          'token' => $response->token
        ]
      ]);
    } catch (Exception $error) {
      return response()->json([
        'message' => $error->getMessage(),
      ], $error->getCode());

    }
  }
}