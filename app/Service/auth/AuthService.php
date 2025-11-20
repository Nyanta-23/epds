<?php

namespace App\Service\Auth;

use App\DTO\Request\Auth\LoginRequestData;
use App\DTO\Response\Auth\LoginResponse;
use App\Models\User;
use Auth;
use Exception;
use Log;

class AuthService
{
  public function login(LoginRequestData $loginRequest): LoginResponse
  {
    try {
      Log::info('params', ['params' => $loginRequest]);
      if (!Auth::attempt(['email' => $loginRequest->email, 'password' => $loginRequest->password])) {
        throw new Exception('email atau password salah', 401);
      }

      $user = User::where('email', $loginRequest->email)->firstOrFail();

      $token = $user->createToken('auth_token')->plainTextToken;

      Log::info('user', ['user' => $user]);
      Log::info('token', ['token' => $token]);

      $response = new LoginResponse();
      $response->id = $user->id;
      $response->email = $user->email;
      $response->name = $user->name;
      $response->token = $token;

      return $response;
    } catch (Exception $error) {
      Log::info($error->getMessage());
      throw new Exception($error->getMessage(), $error->getCode());
    }
  }
}