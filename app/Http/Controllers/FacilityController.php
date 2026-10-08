<?php

namespace App\Http\Controllers;

use App\DTO\Request\Facility\FacilityData;
use App\DTO\Request\Facility\FacilityTypeData;
use App\Http\Requests\Facility\FacilityStoreRequest;
use App\Http\Requests\Facility\FacilityTypeStoreRequest;
use App\Http\Requests\Facility\FacilityTypeUpdateRequest;
use App\Http\Requests\Facility\FacilityUpdateRequest;
use App\Models\Facility;
use App\Models\FacilityType;
use App\Service\Facility\FacilityService;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class FacilityController extends Controller
{
    public function __construct(private FacilityService $facilityService) {}

    public function index(): Response
    {
        $response = $this->facilityService->index();

        return Inertia::render('facility', [
            'facility_types' => $response->facilityTypes->data,
            'facilities' => $response->facilities->data,
        ]);
    }

    public function storeType(FacilityTypeStoreRequest $request): RedirectResponse
    {
        $this->facilityService->storeType(new FacilityTypeData($request->validated('name')));

        return back()->with('success', 'Jenis fasilitas berhasil ditambahkan.');
    }

    public function updateType(FacilityTypeUpdateRequest $request, FacilityType $facilityType): RedirectResponse
    {
        $this->facilityService->updateType(new FacilityTypeData($request->validated('name')), $facilityType->id);

        return back()->with('success', 'Jenis fasilitas berhasil diperbarui.');
    }

    public function destroyType(FacilityType $facilityType): RedirectResponse
    {
        $this->facilityService->deleteType($facilityType->id);

        return back()->with('success', 'Jenis fasilitas berhasil dihapus.');
    }

    public function store(FacilityStoreRequest $request): RedirectResponse
    {
        $this->facilityService->store($this->facilityData($request->validated()));

        return back()->with('success', 'Fasilitas berhasil ditambahkan.');
    }

    public function update(FacilityUpdateRequest $request, Facility $facility): RedirectResponse
    {
        $this->facilityService->update($this->facilityData($request->validated()), $facility->id);

        return back()->with('success', 'Fasilitas berhasil diperbarui.');
    }

    public function destroy(Facility $facility): RedirectResponse
    {
        $this->facilityService->delete($facility->id);

        return back()->with('success', 'Fasilitas berhasil dihapus.');
    }

    /**
     * @param  array{name: string, facility_type_id: string, parent_id?: ?string, province_id: string, regency_id: string, district_id: string, village_id: string}  $attributes
     */
    private function facilityData(array $attributes): FacilityData
    {
        return new FacilityData(
            $attributes['name'],
            $attributes['facility_type_id'],
            $attributes['parent_id'] ?? null,
            [
                'province_id' => $attributes['province_id'],
                'regency_id' => $attributes['regency_id'],
                'district_id' => $attributes['district_id'],
                'village_id' => $attributes['village_id'],
            ],
        );
    }
}
