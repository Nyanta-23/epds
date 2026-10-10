<?php

namespace App\Http\Controllers\Api;

use App\DTO\Request\Patient\PatientUpdateAttributeRequest;
use App\Http\Controllers\Controller;
use App\Http\Requests\Patient\PatientUpdateRequestValidator;
use App\Http\Resources\PatientResource;
use App\Models\User;
use App\Service\Patient\PatientService;
use Exception;
use Illuminate\Http\Request;
use Log;

class PatientController extends Controller
{
    public function __construct(private PatientService $patientService) {}

    public function show(Request $request, ?string $id = null)
    {
        try {
            if ($request->user()->role?->slug === 'patient') {
                if ($id !== null && $id !== $request->user()->id) {
                    return response()->json(['message' => 'Anda tidak memiliki akses ke data pasien ini.'], 403);
                }

                $id = $request->user()->id;
            }

            $search = $request->get('search');
            $response = $this->patientService->getPatients($id, $search);

            $resource = PatientResource::collection($response);

            return response()->json([
                'message' => 'data found',
                'data' => $id ? $resource[0] : $resource,
            ]);
        } catch (Exception $error) {
            return response()->json([
                'message' => $error->getMessage(),
            ], $error->getCode());
        }
    }

    public function update(PatientUpdateRequestValidator $request, string $id)
    {
        try {
            if ($request->user()->role?->slug === 'patient' && $id !== $request->user()->id) {
                return response()->json(['message' => 'Anda tidak memiliki akses untuk mengubah data pasien ini.'], 403);
            }

            $validated = $request->validated();

            $user = User::find($id);

            if (! $user) {
                throw new Exception('pengguna tidak ditemukan', 404);
            }

            $request = new PatientUpdateAttributeRequest;
            $request->name = $validated['name'];
            $request->phone_number = $validated['phone_number'];
            $request->birthplace = $validated['birthplace'];
            $request->date_of_birth = $validated['date_of_birth'];
            $request->job = $validated['job'];
            $request->married_status = $validated['married_status'];
            $request->highest_education = $validated['highest_education'];
            $request->province = $validated['province'] ?? null;
            $request->city_or_district = $validated['city_or_district'] ?? null;
            $request->subdistrict = $validated['subdistrict'] ?? null;
            $request->village = $validated['village'] ?? null;
            $request->province_id = $validated['province_id'];
            $request->city_or_district_id = $validated['city_or_district_id'];
            $request->subdistrict_id = $validated['subdistrict_id'];
            $request->village_id = $validated['village_id'];
            $request->address = $validated['address'];
            $request->facility_id = $validated['facility_id'];

            $request->number_patient = $user->number_patient;

            $response = $this->patientService->update($request, $id);

            Log::info('data', ['data' => $response]);

            return response()->json([
                'message' => 'update successfully',
                'data' => $response,
            ], 200);
        } catch (Exception $error) {
            Log::error('update_patient_error', ['error' => $error->getMessage()]);

            return response()->json([
                'message' => $error->getMessage(),
            ], $error->getCode());
        }
    }

    public function getPostpartumChart(Request $request, ?string $id = null)
    {
        try {
            if ($request->user()->role?->slug === 'patient') {
                if ($id !== null && $id !== $request->user()->id) {
                    return response()->json(['message' => 'Anda tidak memiliki akses ke data pasien ini.'], 403);
                }

                $id = $request->user()->id;
            }

            $response = $this->patientService->getPostpartumChart($id);

            return response()->json([
                'message' => 'data found',
                'data' => $response,
            ]);
        } catch (Exception $error) {
            Log::error('error', ['error' => $error->getMessage()]);

            return response()->json([
                'message' => $error->getMessage(),
                'data' => null,
            ], $error->getCode());
        }
    }
}
