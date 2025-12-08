<?php

namespace App\Http\Controllers\Api;

use App\DTO\Request\User\UserUpdatePasswordRequest;
use App\Http\Controllers\Controller;
use App\Http\Requests\Api\ChangePasswordRequest;
use App\Service\User\UserService;
use Exception;
use Illuminate\Http\Request;

class UserController extends Controller
{
  public function __construct(private UserService $userService)
  {

  }
  public function changeEmail(Request $request, ?string $id = null )
  {
    try {
       $request->validate([
        'email' => ['required', 'email']
      ]);

      $response = $this->userService->changeEmail($request->post('email'), $id);
      
      return response()->json([
        'message' => 'email berhasil dirubah',
        'data' => [
          'id' => $response->id,
          'email' => $response->email,
          'name' => $response->name,
        ]
        ]);
    }catch(Exception $error) {
      return response()->json([
        'message' => $error->getMessage(),
        'data' => null
      ]);
    }
  }

  public function changePassword(ChangePasswordRequest $request, ?string $id = null)
  {
    try {
      $validated =  $request->validated();

      $changeRequest = new UserUpdatePasswordRequest();

      $changeRequest->oldPassword = $validated['old_password'];
      $changeRequest->newPassword = $validated['new_password'];
      $changeRequest->confirmPassword = $validated['confirm_password'];

      $response = $this->userService->changePassword($changeRequest, $id);

      return response()->json([
        'message' => 'password berhasil diganti',
        'data' => $response
      ]);
    }catch(Exception $error) {
      return response()->json([
        'message' => $error->getMessage(),
        'data' => null,
      ]);
    }
  }
}