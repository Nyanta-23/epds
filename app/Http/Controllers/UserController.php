<?php

namespace App\Http\Controllers;

use App\DTO\Request\User\UserStoreAttributeRequest;
use App\DTO\Request\User\UserUpdateAttributeRequest;
use App\Http\Requests\User\UserStoreRequestValidator;
use App\Http\Requests\User\UserUpdateRequestValidator;
use App\Http\Resources\RoleResource;
use Inertia\Inertia;
use App\Http\Resources\UserResource;
use App\Models\User;
use App\Service\Role\RoleService;
use App\Service\User\UserService;
use Illuminate\Http\Request;

class UserController extends Controller
{


    public function __construct(
        private UserService $userService,
        private RoleService $roleService
    ) {}

    public function index(Request $request)
    {
        $whoAmI = auth()->user();

        $filters = [
            'search' => $request->input('search'),
            'only_trash' => $request->boolean('only_trash', false),
            'filter_list' => [
                'select_filter' => [
                    'role' => $request->input('role')
                ],
                // 'checkbox_filter' => []
            ]

        ];

        $users = $this->userService->index($whoAmI, $filters);
        $roles = $this->roleService->getAllRoles();

        return Inertia::render('user', [
            'users' => UserResource::collection($users),
            'extra' => [
                'roles' => RoleResource::collection($roles)
            ],
            'page_prop' => [
                'main_link' => '',
                'filter' => $filters
            ]
        ]);
    }


    public function create()
    {
        $roles = $this->roleService->getAllRoles();

        // Nanti ubah agar tidak dengan super admin

        return Inertia::render('user/action/user-create', [
            'extra' => [
                'roles' => RoleResource::collection($roles)
            ]
        ]);
    }

    public function store(UserStoreRequestValidator $request)
    {

        try {
            $request->validated();

            $userReq = new UserStoreAttributeRequest();
            $userReq->name = $request->post('name');
            $userReq->email = $request->post('email');
            $userReq->password = $request->post('password');
            $userReq->role_id = $request->post('role_id');

            $this->userService->store($userReq);

            return redirect()->route('user')->with('success', 'User with email ' . $userReq->email . ', has been added');
        } catch (\Throwable $th) {
            dump($th->getMessage());
            dd($th);

            return redirect()->back()->with('error', 'An internal server error.');
        }
    }

    public function edit(User $user)
    {
        $roles = $this->roleService->getAllRoles();

        // Nanti ubah agar tidak dengan super admin
        $user->load('role');

        return Inertia::render('user/action/user-edit', [
            'user' => new UserResource($user),
            'extra' => [
                'roles' => RoleResource::collection($roles)
            ]
        ]);
    }

    public function update(UserUpdateRequestValidator $request, User $user)
    {
        try {

            $request->validated();


            $userReq = new UserUpdateAttributeRequest();

            // $userReq->email = $request->post('email');
            $userReq->name = $request->post('name');
            $userReq->role_id = $request->post('role_id');

            $this->userService->update($userReq, $user->id);

            return redirect()->route('user')->with('success', 'User with email ' . $user->email . ', has been updated.');
        } catch (\Throwable $th) {
            dump($th->getMessage());
            dd($th);

            return redirect()->back()->with('error', 'An internal server error.');
        }
    }

    public function destroy(User $user)
    {
        try {
            $this->userService->softDelete($user->id);

            return redirect()->back()->with('success', 'Successfully deleting user.');
        } catch (\Throwable $th) {
            dump($th->getMessage());
            dd($th);
            return redirect()->back()->with('error', 'An internal server error.');
        }
    }
}
