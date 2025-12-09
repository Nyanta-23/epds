<?php

namespace App\Http\Controllers\Api;

use App\DTO\Request\Baby\BabyStoreAttributeRequest;
use App\DTO\Request\Baby\BabyUpdateAttributeRequest;
use App\Http\Controllers\Controller;
use App\Http\Requests\Baby\BabyStoreRequestValidator;
use App\Http\Requests\Baby\BabyUpdateRequestValidator;
use App\Service\Baby\BabyService;
use Exception;
use Illuminate\Http\Request;
use Log;

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
            $babyReq->baby_feeding_method = (int) $request->post('baby_feeding_method');

            $response = $this->babyService->store($babyReq);

            return response()->json([
                'message' => 'successfully add baby',
                'data' => $response
            ], 201);
        } catch (Exception $error) {
            return response()->json([
                'message' => $error->getMessage(),
            ], $error->getCode());
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
        } catch (Exception $error) {
            return response()->json([
                'message' => $error->getMessage()
            ], $error->getCode());
        }
    }

    public function update(BabyUpdateRequestValidator $request, ?string $id = null)
    {
        try {
            $validated = $request->validated();

            $request = new BabyUpdateAttributeRequest();

            $request->which_child = (int) $validated['which_child'];
            $request->date_of_birth = $validated['date_of_birth'];
            $request->baby_condition = (int) $validated['baby_condition'];
            $request->typeof_delivery = (int) $validated['typeof_delivery'];
            $request->gender = $validated['gender'];
            $request->mother_id = $validated['mother_id'];
            $request->baby_feeding_method = (int) $validated['baby_feeding_method'];

            $response = $this->babyService->update($request, $id);

            return response()->json([
                'message' => 'data bayi berhasil diupdate',
                'data' => $response
            ], 200);
        } catch (Exception $error) {
            Log::error('update-baby-error', ['error' => $error->getMessage()]);
            return response()->json([
                'message' => $error->getMessage()
            ], $error->getCode());
        }
    }

    public function destroy(Request $request, ?string $id = null)
    {
        try {
            $this->babyService->softDelete($id);

            return response()->json([
                'message' => 'Data Berhasil dihapus',

            ]);
        } catch (Exception $error) {
            return response()->json([
                'message' => $error->getMessage()
            ], $error->getCode());
        }
    }
}
