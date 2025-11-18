<?php

namespace App\Http\Controllers;

use App\DTO\Request\Baby\BabyStoreAttributeRequest;
use App\DTO\Request\Baby\BabyUpdateAttributeRequest;
use App\Enums\BabyConditionEnum;
use App\Enums\BabyTypeOfDeliveryEnum;
use App\Http\Requests\Baby\BabyStoreRequestValidator;
use App\Http\Requests\Baby\BabyUpdateRequestValidator;
use App\Http\Resources\BabyResource;
use App\Http\Resources\PatientResource;
use App\Models\Baby;
use App\Service\Baby\BabyService;
use App\Service\Patient\PatientService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BabyController extends Controller
{

    public function __construct(
        private BabyService $babyService,
        private PatientService $patientService
    ) {}

    public function index(Request $request)
    {
        $filters = [
            'search' => $request->input('search'),
            'only_trash' => $request->boolean('only_trash', false),
        ];

        $babies = $this->babyService->index($filters);

        return Inertia::render('baby', [
            'babies' => BabyResource::collection($babies),
            'page_prop' => [
                'filter' => $filters
            ]
        ]);
    }

    public function create()
    {
        $patients = $this->patientService->getPatients();

        return Inertia::render('baby/action/baby-create', [
            'extra' => [
                'patients' => PatientResource::collection($patients)
            ],
            'page_prop' => [
                'enums' => [
                    'baby_conditions' => BabyConditionEnum::options(),
                    'baby_typeof_deliveries' => BabyTypeOfDeliveryEnum::options(),
                ]
            ]
        ]);
    }

    public function edit(Baby $baby)
    {
        $patients = $this->patientService->getPatients();

        $baby->load('mother');

        // dump($baby->load('mother'));

        // dd($baby->load('mother'));

        return Inertia::render('baby/action/baby-edit', [
            'baby' => new BabyResource($baby),
            'extra' => [
                'patients' => PatientResource::collection($patients)
            ],
            'page_prop' => [
                'enums' => [
                    'baby_conditions' => BabyConditionEnum::options(),
                    'baby_typeof_deliveries' => BabyTypeOfDeliveryEnum::options(),
                ]
            ]
        ]);
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

            $this->babyService->store($babyReq);


            return redirect()->route('baby')->with('success', 'Baby, has been added.');
        } catch (\Throwable $th) {
            dump($th->getMessage());
            dd($th);

            return redirect()->back()->with('error', 'An internal server error.');
        }
    }


    public function update(BabyUpdateRequestValidator $request, Baby $baby)
    {
        try {

            $request->validated();

            $babyReq = new BabyUpdateAttributeRequest();


            $babyReq->which_child = (int) $request->post('which_child');
            $babyReq->date_of_birth = $request->post('date_of_birth');
            $babyReq->baby_condition = (int) $request->post('baby_condition');
            $babyReq->typeof_delivery = (int) $request->post('typeof_delivery');
            $babyReq->gender = $request->post('gender');
            $babyReq->mother_id = $request->post('mother_id');

            
            $this->babyService->update($babyReq, $baby->id);

            return redirect()->route('baby')->with('success', 'Baby has been updated.');
        } catch (\Throwable $th) {
            dump($th->getMessage());
            dd($th);

            return redirect()->back()->with('error', 'An internal server error.');
        }
    }



    public function destroy(Baby $baby)
    {
        try {

            $this->babyService->softDelete($baby->id);

            return redirect()->back()->with('success', 'Successfully deleting baby.');
        } catch (\Throwable $th) {
            dump($th->getMessage());
            dd($th);
            return redirect()->back()->with('error', 'An internal server error.');
        }
    }

}
