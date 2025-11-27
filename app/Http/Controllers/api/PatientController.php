<?php

namespace App\Http\Controllers\Api;

use App\DTO\Request\Patient\PatientUpdateAttributeRequest;
use App\Http\Controllers\Controller;
use App\Http\Requests\Patient\PatientUpdateRequestValidator;
use App\Http\Resources\PatientResource;
use App\Service\Patient\PatientService;
use Exception;
use Log;
use Request;

class PatientController extends Controller
{
  public function __construct(private PatientService $patientService)
  {

  }

  public function show(Request $request, ?string $id = null)
  {
    try {
      $response = $this->patientService->getPatients($id);

      $resource = PatientResource::collection($response);

      return response()->json([
        'message' => 'data found',
        'data' => $id ? $resource[0] : $resource
      ]);
    } catch (Exception $error) {
      return response()->json([
        'message' => $error->getMessage()
      ], $error->getCode());
    }
  }

  public function update(PatientUpdateRequestValidator $request, string $id)
  {
    try {
      $validated = $request->validated();

      $request = new PatientUpdateAttributeRequest();
      $request->name = $validated['name'];
      $request->phone_number = $validated['phone_number'];
      $request->birthplace = $validated['birthplace'];
      $request->date_of_birth = $validated['date_of_birth'];
      $request->job = $validated['job'];
      $request->married_status = $validated['married_status'];
      $request->highest_education = $validated['highest_education'];
      $request->province = $validated['province'];
      $request->city_or_district = $validated['city_or_district'];
      $request->subdistrict = $validated['subdistrict'];
      $request->village = $validated['village'];
      $request->province_id = $validated['province_id'];
      $request->city_or_district_id = $validated['city_or_district_id'];
      $request->subdistrict_id = $validated['subdistrict_id'];
      $request->village_id = $validated['village_id'];
      $request->address = $validated['address'];

      $response = $this->patientService->update($request, $id);

      Log::info('data', ['data' => $response]);

      return response()->json([
        'message' => 'update successfully',
        'data' => $response
      ], 200);

    } catch (Exception $error) {
      Log::error('update_patient_error', ['error' => $error->getMessage()]);
      return response()->json([
        'message' => $error->getMessage()
      ], $error->getCode());
    }
  }

  public function getPostpartumChart(Request $request, ?string $id = null)
  {
    try {
      $response = $this->patientService->getPostpartumChart($id);

      return response()->json([
        'message' => 'data found',
        'data' => $response
      ]);
    } catch (Exception $error) {
      return response()->json([
        'message' => $error->getMessage(),
        'data' => null
      ], $error->getCode());
    }
  }
}