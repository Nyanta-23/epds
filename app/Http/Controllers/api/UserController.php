<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
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
}