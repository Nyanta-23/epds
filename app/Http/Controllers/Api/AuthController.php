<?php

namespace App\Http\Controllers\Api;

use App\DTO\Request\Auth\LoginRequestData;
use App\DTO\Request\Auth\RegisterRequestData;
use App\Http\Controllers\Controller;
use App\Http\Requests\Api\LoginRequest;
use App\Http\Requests\Api\RegisterRequest;
use App\Models\User;
use App\Service\Auth\AuthService;
use App\Service\Baby\BabyService;
use App\Service\Patient\PatientService;
use Exception;
use Illuminate\Auth\Events\Verified;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Log;

class AuthController extends Controller
{
  public function __construct(private AuthService $authService, private PatientService $patientService, private BabyService $babyService)
  {
  }

  public function login(LoginRequest $request)
  {
    $validated = $request->validated();

    try {
      $request = new LoginRequestData();
      $request->email = $validated['email'];
      $request->password = $validated['password'];

      $response = $this->authService->login($request);
      $hasProfile = $this->patientService->isProfileFilled($response->id);
      $hasBaby = $this->babyService->isBabyFilled($response->id);

      return response()->json([
        'message' => 'Login Berhasil',
        'data' => [
          'id' => $response->id,
          'email' => $response->email,
          'name' => $response->name,
          'token' => $response->token,
          'has_profile' => $hasProfile,
          'has_baby' => $hasBaby
        ]
      ]);
    } catch (Exception $error) {
      return response()->json([
        'message' => $error->getMessage(),
      ], $error->getCode());
    }
  }

  public function register(RegisterRequest $request)
  {
    $validated = $request->validated();

    try {
      $request = new RegisterRequestData();
      $request->email = $validated['email'];
      $request->name = $validated['name'];
      $request->password = $validated['password'];

      $response = $this->authService->register($request);

      return response()->json([
        'data' => [
          'id' => $response->id,
          'email' => $response->email,
          'name' => $response->name
        ]
      ], 201);
    } catch (Exception $error) {

      Log::error($error);

      return response()->json([
        'message' => $error->getMessage(),
      ], $error->getCode());
    }
  }

  public function logout(Request $request)
  {
    $request->user()->currentAccessToken()->delete();

    return response()->json([
      'message' => 'logout berhasil'
    ], 200);
  }
}
