<?php

namespace App\Http\Controllers;

use App\DTO\Request\Patient\PatientUpdateAttributeRequest;
use App\Http\Requests\Patient\PatientUpdateRequestValidator;
use App\Http\Resources\PatientResource;
use App\Http\Resources\Utils\VerifiedResource;
use App\Models\User;
use App\Service\Patient\PatientService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PatientController extends Controller
{

    public function __construct(
        private PatientService $patientService,
    ) {}

    public function index(Request $request)
    {

        $filters = [
            'search' => $request->input('search'),
            'filter_list' => [
                'select_filter' => [
                    'is_verified' => $request->input('is_verified'),
                    'is_can_visit' => $request->input('is_can_visit')
                ],
            ]
        ];

        $patients = $this->patientService->index($filters);

        return Inertia::render('patient', [
            'patients' => PatientResource::collection($patients),
            'page_prop' => [
                'filter' => $filters
            ]
        ]);
    }

    public function show(User $user)
    {
        return Inertia::render(
            'patient/action/patient-show',
            [
                'patient' => new PatientResource($user)
            ]
        );
    }


    public function edit(User $user)
    {

        return Inertia::render('patient/action/patient-edit', [
            'patient' => new PatientResource($user),
        ]);
    }

    public function update(PatientUpdateRequestValidator $request, User $user)
    {
        try {

            $request->validated();

            $patientReq = new PatientUpdateAttributeRequest();

            $patientReq->name = $request->input('name');
            $patientReq->phone_number = $request->input('phone_number');
            $patientReq->birthplace = $request->input('birthplace');
            $patientReq->date_of_birth = $request->input('date_of_birth');
            $patientReq->birthplace = $request->input('birthplace');
            $patientReq->job = $request->input('job');
            $patientReq->married_status = $request->input('married_status');
            $patientReq->highest_education = $request->input('highest_education');
            $patientReq->province = $request->input('province');
            $patientReq->city_or_district = $request->input('city_or_district');
            $patientReq->subdistrict = $request->input('subdistrict');
            $patientReq->village = $request->input('village');

            $patientReq->province_id = $request->input('province_id');
            $patientReq->city_or_district_id = $request->input('city_or_district_id');
            $patientReq->subdistrict_id = $request->input('subdistrict_id');
            $patientReq->village_id = $request->input('village_id');

            $patientReq->address = $request->input('address');

            $this->patientService->update($patientReq, $user->id);

            return redirect()->route('patient')->with('success', 'User with email ' . $user->email . ', has been updated.');
        } catch (\Throwable $th) {
            dump($th->getMessage());
            dd($th);

            return redirect()->back()->with('error', 'An internal server error.');
        }
    }


    public function visit(User $user)
    {
        try {

            $result = $this->patientService->visit($user->id);

            $message = $result->is_can_visit ? 'can visit' : 'can\'t visit';

            return redirect()->route('patient')->with('success', 'User with email ' . $user->email . ', now ' . $message . '.');
        } catch (\Throwable $th) {

            dump($th->getMessage());
            dd($th);

            return redirect()->back()->with('error', 'An internal server error.');
        }
    }

    public function verification(User $user)
    {
        try {

            $result = $this->patientService->verification($user->id);

            $message = $result->is_can_visit ? 'verified' : 'unverified';

            return redirect()->route('patient')->with('success', 'User with email ' . $user->email . ', now is ' . $message . '.');
        } catch (\Throwable $th) {

            dump($th->getMessage());
            dd($th);

            return redirect()->back()->with('error', 'An internal server error.');
        }
    }
}
