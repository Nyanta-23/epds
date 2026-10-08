<?php

namespace App\Service\Facility;

use App\DTO\Request\Facility\FacilityData;
use App\DTO\Request\Facility\FacilityTypeData;
use App\DTO\Response\Facility\FacilityManagementResponse;
use App\DTO\Response\Facility\FacilityResponse;
use App\DTO\Response\Facility\FacilityTypeResponse;
use App\Models\Facility;
use App\Models\FacilityType;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class FacilityService
{
    public function index(): FacilityManagementResponse
    {
        $types = FacilityType::query()
            ->orderBy('name')
            ->get(['id', 'name'])
            ->map(fn (FacilityType $type): array => [
                'id' => $type->id,
                'name' => $type->name,
            ])
            ->all();

        $facilities = Facility::query()
            ->with([
                'facilityType:id,name',
                'parent:id,name',
                'province:id,name',
                'regency:id,name',
                'district:id,name',
                'village:id,name',
            ])
            ->orderBy('name')
            ->get()
            ->map(fn (Facility $facility): array => [
                'id' => $facility->id,
                'name' => $facility->name,
                'facility_type_id' => $facility->facility_type_id,
                'facility_type' => $facility->facilityType ? [
                    'id' => $facility->facilityType->id,
                    'name' => $facility->facilityType->name,
                ] : null,
                'parent_id' => $facility->parent_id,
                'parent_name' => $facility->parent?->name,
                'province_id' => $facility->province_id,
                'province' => $facility->province?->name,
                'regency_id' => $facility->regency_id,
                'regency' => $facility->regency?->name,
                'district_id' => $facility->district_id,
                'district' => $facility->district?->name,
                'village_id' => $facility->village_id,
                'village' => $facility->village?->name,
            ])
            ->all();

        return new FacilityManagementResponse(
            new FacilityTypeResponse($types),
            new FacilityResponse($facilities),
        );
    }

    public function storeType(FacilityTypeData $data): FacilityType
    {
        return DB::transaction(fn (): FacilityType => FacilityType::create(['name' => $data->name]));
    }

    public function updateType(FacilityTypeData $data, string $id): FacilityType
    {
        return DB::transaction(function () use ($data, $id): FacilityType {
            $facilityType = FacilityType::query()->findOrFail($id);
            $facilityType->update(['name' => $data->name]);

            return $facilityType;
        });
    }

    public function deleteType(string $id): void
    {
        DB::transaction(function () use ($id): void {
            $facilityType = FacilityType::query()->findOrFail($id);

            if ($facilityType->facilities()->exists()) {
                throw ValidationException::withMessages([
                    'facility_type' => 'Jenis fasilitas masih digunakan dan tidak dapat dihapus.',
                ]);
            }

            $facilityType->forceFill(['is_deleted' => true])->save();
            $facilityType->delete();
        });
    }

    public function store(FacilityData $data): Facility
    {
        return DB::transaction(fn (): Facility => Facility::create($this->facilityAttributes($data)));
    }

    public function update(FacilityData $data, string $id): Facility
    {
        return DB::transaction(function () use ($data, $id): Facility {
            $facility = Facility::query()->findOrFail($id);
            $this->assertParentIsNotDescendant($facility, $data->parent_id);
            $facility->update($this->facilityAttributes($data));

            return $facility;
        });
    }

    public function delete(string $id): void
    {
        DB::transaction(function () use ($id): void {
            $facility = Facility::query()->findOrFail($id);

            if ($facility->children()->exists() || $facility->users()->exists()) {
                throw ValidationException::withMessages([
                    'facility' => 'Fasilitas ini masih memiliki fasilitas turunan atau pengguna.',
                ]);
            }

            $facility->forceFill(['is_deleted' => true])->save();
            $facility->delete();
        });
    }

    /**
     * @return array{name: string, facility_type_id: string, parent_id: ?string, province_id: string, regency_id: string, district_id: string, village_id: string}
     */
    private function facilityAttributes(FacilityData $data): array
    {
        return [
            'name' => $data->name,
            'facility_type_id' => $data->facility_type_id,
            'parent_id' => $data->parent_id,
            ...$data->attributes,
        ];
    }

    private function assertParentIsNotDescendant(Facility $facility, ?string $parentId): void
    {
        $currentParentId = $parentId;

        while ($currentParentId !== null) {
            if ($currentParentId === $facility->id) {
                throw ValidationException::withMessages([
                    'parent_id' => 'Fasilitas tidak dapat menjadi induk dari dirinya sendiri atau turunannya.',
                ]);
            }

            $currentParentId = Facility::query()
                ->whereKey($currentParentId)
                ->value('parent_id');
        }
    }
}
