<?php

namespace App\Http\Controllers\Api;

use App\DTO\Request\Baby\BabyStoreAttributeRequest;
use App\Http\Controllers\Controller;
use App\Http\Requests\Baby\BabyStoreRequestValidator;
use App\Service\Baby\BabyService;
use Exception;
use Illuminate\Http\Request;

class BabyController extends Controller
{
    public function __construct(private BabyService $babyService)
    {

    }

    public function store(BabyStoreRequestValidator $request) 
    {
        try {
            $request->validated();

            $babyReq = new BabyStoreAttributeRequest();

            $babyReq->which_child = (int) $request->post('which_child');
            $babyReq->date_of_birth = $request->post('date_of_birth');
            $babyReq->baby_condition = (int) $request->post('baby_condition');
            $babyReq->typeof_delivery = (int) $request->post('typeof_delivery');
            $babyReq->gender = $request->post('gender');
            $babyReq->mother_id = $request->post('mother_id');

            $response = $this->babyService->store($babyReq);

            return response()->json([
                'message' => 'successfully add baby',
                'data' => $response
            ], 201);
        } catch (Exception $error) {
            return response()->json([
                'message' => $error->getMessage(),
            ],$error->getCode());
        }
    }

    public function find(Request $request, ?string $id) 
    {
        try {
            $response = $this->babyService->find($id);

            return response()->json([
                'message' => 'data bayi ditemukan',
                'data' => $response
            ], 200);
        } catch(Exception $error) {
            return response()->json([
                'message' => $error->getMessage()
            ], $error->getCode());
        }
    }
}
