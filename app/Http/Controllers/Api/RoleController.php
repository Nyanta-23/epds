<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\RoleResource;
use App\Service\Role\RoleService;
use Exception;
use Illuminate\Http\Request;

class RoleController extends Controller
{
    public function __construct(private RoleService $roleService)
    {
    }

    public function index(Request $request)
    {
        try {
            $whoAmI = auth()->user();
            $roles = $this->roleService->getAllRoles($whoAmI);

            return response()->json([
                'message' => 'roles found',
                'data' => RoleResource::collection($roles)
            ]);
        } catch (Exception $error) {
            return response()->json([
                'message' => $error->getMessage()
            ], 500);
        }
    }
}
