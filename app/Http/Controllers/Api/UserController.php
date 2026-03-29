<?php

namespace App\Http\Controllers\Api;

use App\DTO\Request\User\UserStoreAttributeRequest;
use App\DTO\Request\User\UserUpdateAttributeRequest;
use App\DTO\Request\User\UserUpdatePasswordRequest;
use App\Http\Controllers\Controller;
use App\Http\Requests\Api\ChangePasswordRequest;
use App\Http\Requests\User\UserStoreRequestValidator;
use App\Http\Requests\User\UserUpdateRequestValidator;
use App\Http\Resources\UserResource;
use App\Models\User;
use App\Service\User\UserService;
use Exception;
use Illuminate\Http\Request;

class UserController extends Controller
{
  public function __construct(private UserService $userService)
  {

  }

  public function index(Request $request)
  {
    try {
      $whoAmI = auth()->user();

      $filters = [
        'search' => $request->input('search'),
        'role' => $request->input('role'),
        'only_trash' => $request->boolean('only_trash', false),
        'filter_list' => [
          'select_filter' => [
            'role' => $request->input('role')
          ]
        ]
      ];

      $users = $this->userService->index($whoAmI, $filters);

      return response()->json([
        'message' => 'users found',
        'data' => UserResource::collection($users)->response()->getData(true)
      ]);
    } catch (Exception $error) {
      return response()->json([
        'message' => $error->getMessage()
      ], 500);
    }
  }

  public function store(UserStoreRequestValidator $request)
  {
    try {
      $validated = $request->validated();

      $userReq = new UserStoreAttributeRequest();
      $userReq->name = $validated['name'];
      $userReq->email = $validated['email'];
      $userReq->password = $validated['password'];
      $userReq->role_id = $validated['role_id'];
      $userReq->province_id = $validated['province_id'] ?? null;
      $userReq->regency_id = $validated['regency_id'] ?? null;
      $userReq->district_id = $validated['district_id'] ?? null;
      $userReq->village_id = $validated['village_id'] ?? null;
      $userReq->province = $validated['province'] ?? null;
      $userReq->city_or_district = $validated['city_or_district'] ?? null;
      $userReq->subdistrict = $validated['subdistrict'] ?? null;
      $userReq->village = $validated['village'] ?? null;
      $userReq->instansi = $validated['instansi'] ?? null;
      $userReq->nama_instansi = $validated['nama_instansi'] ?? null;

      $user = $this->userService->store($userReq);

      return response()->json([
        'message' => 'user created successfully',
        'data' => $user
      ], 201);
    } catch (Exception $error) {
      return response()->json([
        'message' => $error->getMessage()
      ], 500);
    }
  }

  public function update(UserUpdateRequestValidator $request, string $id)
  {
    try {
      $validated = $request->validated();
      $userReq = new UserUpdateAttributeRequest();

      $userReq->name = $validated['name'];
      $userReq->role_id = $validated['role_id'];
      $userReq->province_id = $validated['province_id'] ?? null;
      $userReq->regency_id = $validated['regency_id'] ?? null;
      $userReq->district_id = $validated['district_id'] ?? null;
      $userReq->village_id = $validated['village_id'] ?? null;
      $userReq->province = $validated['province'] ?? null;
      $userReq->city_or_district = $validated['city_or_district'] ?? null;
      $userReq->subdistrict = $validated['subdistrict'] ?? null;
      $userReq->village = $validated['village'] ?? null;
      
      if (isset($validated['email'])) {
        $userReq->email = $validated['email'];
      }
      if (isset($validated['password'])) {
        $userReq->password = $validated['password'];
      }
      $userReq->instansi = $validated['instansi'] ?? null;
      $userReq->nama_instansi = $validated['nama_instansi'] ?? null;

      $this->userService->update($userReq, $id);

      return response()->json([
        'message' => 'user updated successfully'
      ]);
    } catch (Exception $error) {
      return response()->json([
        'message' => $error->getMessage()
      ], 500);
    }
  }

  public function destroy(string $id)
  {
    try {
      $this->userService->softDelete($id);

      return response()->json([
        'message' => 'user deleted successfully'
      ]);
    } catch (Exception $error) {
      return response()->json([
        'message' => $error->getMessage()
      ], 500);
    }
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