<?php

namespace App\Http\Controllers;

use App\Http\Resources\RoleResource;
use App\Service\Role\RoleService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RoleController extends Controller
{

    public function __construct(
        private RoleService $roleService
    ) {}

    public function index()
    {

        $roles = $this->roleService->index();

        return Inertia::render('role', [
            'roles' => RoleResource::collection($roles)
        ]);
    }
}
