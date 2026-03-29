<?php

namespace App\Service\Auth;

use App\DTO\Request\Auth\LoginRequestData;
use App\DTO\Request\Auth\RegisterRequestData;
use App\DTO\Response\Auth\LoginResponse;
use App\DTO\Response\Auth\RegisterResponse;
use App\Models\Role;
use App\Models\User;
use Auth;
use DB;
use Exception;
use Illuminate\Auth\Events\Registered;
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
      $response->role = $user->role->slug;

      return $response;
    } catch (Exception $error) {
      Log::info($error->getMessage());
      throw new Exception($error->getMessage(), $error->getCode());
    }
  }

  public function register(RegisterRequestData $request): RegisterResponse
  {
    try {
      $findUser = User::where(['email' => $request->email])->first();

      if ($findUser)
        throw new Exception('email sudah terdaftar', 400);

      $user = User::create([
        'email' => $request->email,
        'name' => $request->name,
        'password' => $request->password,
        'role_id' => Role::where('slug', 'patient')->first()->id,
        'number_patient' => $this->generatePatientNumber(),
        'email_verified_at' => now(),
      ]);

      $response = new RegisterResponse();
      $response->id = $user->id;
      $response->name = $user->name;
      $response->email = $user->email;

      return $response;

    } catch (Exception $error) {
      Log::error('register_error_message', ['error' => $error->getMessage()]);
      throw new Exception($error->getMessage(), $error->getCode());
    }
  }

  private static function generatePatientNumber()
{
    $prefix = 'PS-' . date('ym') . '-';

    return DB::transaction(function () use ($prefix) {
        $lastUser = User::where('number_patient', 'like', $prefix . '%')
            ->lockForUpdate()
            ->orderBy('number_patient', 'desc')
            ->first();

        if (!$lastUser) {
            $number = 1;
        } else {
            $lastNumber = (int) substr($lastUser->number_patient, -4);
            $number = $lastNumber + 1;
        }
        return $prefix . str_pad($number, 4, '0', STR_PAD_LEFT);
    });
}
}