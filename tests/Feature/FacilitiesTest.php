<?php

namespace Tests\Feature;

use App\Models\Facility;
use App\Models\FacilityType;
use App\Models\PostpartumVisit;
use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Tests\TestCase;

class FacilitiesTest extends TestCase
{
    use RefreshDatabase;

    public function test_super_admin_can_create_update_and_soft_delete_facility_types(): void
    {
        $this->actingAs($this->userWithRole('super_admin'));

        $this->post(route('facility.type.store'), ['name' => 'Klinik'])
            ->assertRedirect();

        $facilityType = FacilityType::query()->firstOrFail();
        $this->assertSame('Klinik', $facilityType->name);

        $this->put(route('facility.type.update', $facilityType), ['name' => 'Klinik Pratama'])
            ->assertRedirect();
        $this->assertSame('Klinik Pratama', $facilityType->fresh()->name);

        $this->delete(route('facility.type.destroy', $facilityType))->assertRedirect();
        $this->assertSoftDeleted($facilityType);
        $this->assertTrue(FacilityType::withTrashed()->findOrFail($facilityType->id)->is_deleted);
    }

    public function test_facility_type_validation_rejects_duplicate_and_overlong_names(): void
    {
        $this->actingAs($this->userWithRole('super_admin'));
        FacilityType::query()->create(['name' => 'Puskesmas']);

        $this->from(route('facility.index'))
            ->post(route('facility.type.store'), ['name' => 'Puskesmas'])
            ->assertSessionHasErrors('name');

        $this->from(route('facility.index'))
            ->post(route('facility.type.store'), ['name' => str_repeat('a', 41)])
            ->assertSessionHasErrors('name');
    }

    public function test_super_admin_can_create_update_and_soft_delete_facilities(): void
    {
        $this->seedRegion();
        $this->actingAs($this->userWithRole('super_admin'));
        $facilityType = FacilityType::query()->create(['name' => 'Puskesmas']);
        $attributes = [
            'name' => 'Puskesmas Contoh',
            'facility_type_id' => $facilityType->id,
            'parent_id' => null,
            'province_id' => '11',
            'regency_id' => '1101',
            'district_id' => '1101010',
            'village_id' => '1101010001',
        ];

        $this->post(route('facility.store'), $attributes)->assertRedirect();
        $facility = Facility::query()->firstOrFail();
        $this->assertSame('Puskesmas Contoh', $facility->name);

        $this->put(route('facility.update', $facility), [...$attributes, 'name' => 'Puskesmas Baru'])
            ->assertRedirect();
        $this->assertSame('Puskesmas Baru', $facility->fresh()->name);

        $this->delete(route('facility.destroy', $facility))->assertRedirect();
        $this->assertSoftDeleted($facility);
        $this->assertTrue(Facility::withTrashed()->findOrFail($facility->id)->is_deleted);
    }

    public function test_midwives_can_manage_facilities_but_admins_cannot(): void
    {
        $this->actingAs($this->userWithRole('midwife'));
        $this->get(route('facility.index'))->assertOk();

        $this->actingAs($this->userWithRole('admin'));
        $this->get(route('facility.index'))->assertForbidden();
    }

    public function test_midwife_can_only_query_patients_and_screenings_in_their_facility(): void
    {
        $this->seedRegion();
        $facilityType = FacilityType::query()->create(['name' => 'Puskesmas']);
        $facilityA = $this->createFacility($facilityType, 'Fasilitas A');
        $facilityB = $this->createFacility($facilityType, 'Fasilitas B');
        $midwife = $this->userWithRole('midwife');
        $midwife->update(['facility_id' => $facilityA->id]);
        $patientA = $this->userWithRole('patient');
        $patientA->update(['facility_id' => $facilityA->id]);
        $patientB = $this->userWithRole('patient');
        $patientB->update(['facility_id' => $facilityB->id]);

        $visitA = PostpartumVisit::factory()->create([
            'visit_number' => 1,
            'mother_id' => $patientA->id,
            'facility_id' => $facilityA->id,
            'parity_count' => '1x',
            'baby_caregiver' => 0,
        ]);
        $visitB = PostpartumVisit::factory()->create([
            'visit_number' => 1,
            'mother_id' => $patientB->id,
            'facility_id' => $facilityB->id,
            'parity_count' => '1x',
            'baby_caregiver' => 0,
        ]);
        $legacyVisit = PostpartumVisit::factory()->create([
            'visit_number' => 2,
            'mother_id' => $patientA->id,
            'facility_id' => null,
            'parity_count' => '1x',
            'baby_caregiver' => 0,
        ]);

        $this->actingAs($midwife);

        $this->assertSame(
            [$patientA->id],
            User::query()->whereHas('role', fn ($query) => $query->where('slug', 'patient'))->pluck('id')->all(),
        );
        $this->assertSame([$visitA->id], PostpartumVisit::query()->pluck('id')->all());
        $this->assertNull(PostpartumVisit::query()->find($legacyVisit->id));
        $this->get(route('postpartum.show', $visitB->id))->assertNotFound();
        $this->get(route('postpartum.show', $legacyVisit->id))->assertNotFound();

        $this->actingAs($this->userWithRole('admin'));
        $this->assertSame(3, PostpartumVisit::query()->count());
    }

    public function test_midwife_without_a_facility_cannot_query_patients_or_screenings(): void
    {
        $this->seedRegion();
        $facilityType = FacilityType::query()->create(['name' => 'Puskesmas']);
        $facility = $this->createFacility($facilityType, 'Fasilitas A');
        $midwife = $this->userWithRole('midwife');
        $patient = $this->userWithRole('patient');
        $patient->update(['facility_id' => $facility->id]);
        PostpartumVisit::factory()->create([
            'visit_number' => 1,
            'mother_id' => $patient->id,
            'facility_id' => $facility->id,
            'parity_count' => '1x',
            'baby_caregiver' => 0,
        ]);

        $this->actingAs($midwife);

        $this->assertSame(0, User::query()->whereHas('role', fn ($query) => $query->where('slug', 'patient'))->count());
        $this->assertSame(0, PostpartumVisit::query()->count());
    }

    public function test_facility_type_in_use_cannot_be_deleted(): void
    {
        $this->seedRegion();
        $this->actingAs($this->userWithRole('super_admin'));
        $facilityType = FacilityType::query()->create(['name' => 'Puskesmas']);
        Facility::query()->create([
            'name' => 'Puskesmas Contoh',
            'facility_type_id' => $facilityType->id,
            'province_id' => '11',
            'regency_id' => '1101',
            'district_id' => '1101010',
            'village_id' => '1101010001',
        ]);

        $this->from(route('facility.index'))
            ->delete(route('facility.type.destroy', $facilityType))
            ->assertSessionHasErrors('facility_type');
        $this->assertNull($facilityType->fresh()->deleted_at);
    }

    public function test_region_options_are_loaded_from_database_in_hierarchical_order(): void
    {
        $this->seedRegion();
        $this->actingAs($this->userWithRole('super_admin'));

        $this->getJson(route('region.provinces'))
            ->assertOk()
            ->assertJsonPath('data.0.code', '11')
            ->assertJsonPath('data.0.name', 'Aceh');
        $this->getJson(route('region.regencies', '11'))
            ->assertOk()
            ->assertJsonPath('data.0.code', '1101');
        $this->getJson(route('region.districts', '1101'))
            ->assertOk()
            ->assertJsonPath('data.0.code', '1101010');
        $this->getJson(route('region.villages', '1101010'))
            ->assertOk()
            ->assertJsonPath('data.0.code', '1101010001');
        $this->getJson(route('region.regencies', '12'))
            ->assertOk()
            ->assertJsonCount(0, 'data');
    }

    public function test_public_api_returns_local_region_options_in_hierarchical_order(): void
    {
        $this->seedRegion();

        $this->getJson('/api/v1/region/provinces')
            ->assertOk()
            ->assertExactJson([
                'data' => [
                    ['code' => '11', 'name' => 'Aceh'],
                ],
            ]);

        $this->getJson('/api/v1/region/regencies/11')
            ->assertOk()
            ->assertExactJson([
                'data' => [
                    ['code' => '1101', 'name' => 'Kabupaten Simeulue'],
                ],
            ]);

        $this->getJson('/api/v1/region/districts/1101')
            ->assertOk()
            ->assertExactJson([
                'data' => [
                    ['code' => '1101010', 'name' => 'Teupah Selatan'],
                ],
            ]);

        $this->getJson('/api/v1/region/villages/1101010')
            ->assertOk()
            ->assertExactJson([
                'data' => [
                    ['code' => '1101010001', 'name' => 'Lataling'],
                ],
            ]);

        $this->getJson('/api/v1/region/regencies/12')
            ->assertOk()
            ->assertExactJson(['data' => []]);
    }

    public function test_public_api_returns_only_active_facilities_in_the_requested_regency(): void
    {
        $this->seedRegion();
        DB::table('regencies')->insert([
            'id' => '1102',
            'province_id' => '11',
            'name' => 'Kabupaten Pidie',
        ]);
        $facilityType = FacilityType::query()->create(['name' => 'Puskesmas']);
        $active = $this->createFacility($facilityType, 'Puskesmas Aktif');
        $deleted = $this->createFacility($facilityType, 'Puskesmas Terhapus');
        $deleted->delete();
        $flaggedDeleted = $this->createFacility($facilityType, 'Puskesmas Nonaktif');
        $flaggedDeleted->update(['is_deleted' => true]);
        $otherRegency = $this->createFacility($facilityType, 'Puskesmas Lain');
        $otherRegency->update(['regency_id' => '1102']);

        $this->getJson('/api/v1/facilities?regency_id=1101')
            ->assertOk()
            ->assertExactJson([
                'data' => [
                    [
                        'id' => $active->id,
                        'name' => 'Puskesmas Aktif',
                        'facility_type' => 'Puskesmas',
                    ],
                ],
            ]);

        $this->getJson('/api/v1/facilities')
            ->assertUnprocessable()
            ->assertJsonValidationErrors('regency_id');
    }

    public function test_patient_profile_update_persists_local_regions_and_selected_facility(): void
    {
        $this->seedRegion();
        $facilityType = FacilityType::query()->create(['name' => 'Puskesmas']);
        $facility = $this->createFacility($facilityType, 'Puskesmas Pilihan');
        $patient = $this->userWithRole('patient');

        $this->actingAs($patient, 'sanctum')
            ->putJson("/api/v1/patient/{$patient->id}", [
                'name' => $patient->name,
                'phone_number' => '081234567890',
                'birthplace' => 'Aceh',
                'date_of_birth' => '1990-05-15',
                'job' => 'Ibu Rumah Tangga',
                'married_status' => 'married',
                'highest_education' => 'SMA',
                'province' => 'Nama provinsi buatan',
                'city_or_district' => 'Nama kabupaten buatan',
                'subdistrict' => 'Nama kecamatan buatan',
                'village' => 'Nama desa buatan',
                'province_id' => '11',
                'city_or_district_id' => '1101',
                'subdistrict_id' => '1101010',
                'village_id' => '1101010001',
                'address' => 'Jalan Sehat',
                'facility_id' => $facility->id,
            ])
            ->assertOk()
            ->assertJsonPath('data.facility_id', $facility->id)
            ->assertJsonPath('data.province', 'Aceh')
            ->assertJsonPath('data.city_or_district', 'Kabupaten Simeulue')
            ->assertJsonPath('data.subdistrict', 'Teupah Selatan')
            ->assertJsonPath('data.village', 'Lataling');

        $this->assertDatabaseHas('users', [
            'id' => $patient->id,
            'facility_id' => $facility->id,
            'province_id' => '11',
            'city_or_district_id' => '1101',
            'subdistrict_id' => '1101010',
            'village_id' => '1101010001',
            'province_migrate_id' => '11',
            'regency_migrate_id' => '1101',
            'district_migrate_id' => '1101010',
            'village_migrate_id' => '1101010001',
        ]);
    }

    public function test_patient_profile_update_rejects_region_codes_outside_the_selected_hierarchy(): void
    {
        $this->seedRegion();
        DB::table('provinces')->insert(['id' => '12', 'name' => 'Sumatera Utara']);
        DB::table('regencies')->insert([
            'id' => '1201',
            'province_id' => '12',
            'name' => 'Kabupaten Tapanuli Selatan',
        ]);
        $facilityType = FacilityType::query()->create(['name' => 'Puskesmas']);
        $facility = $this->createFacility($facilityType, 'Puskesmas Pilihan');
        $patient = $this->userWithRole('patient');

        $this->actingAs($patient, 'sanctum')
            ->putJson("/api/v1/patient/{$patient->id}", [
                ...$this->validPatientProfileAttributes($facility->id),
                'city_or_district_id' => '1201',
            ])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['city_or_district_id', 'facility_id']);
    }

    public function test_patient_profile_update_requires_facility_and_local_region_codes(): void
    {
        $this->seedRegion();
        $patient = $this->userWithRole('patient');

        $this->actingAs($patient, 'sanctum')
            ->putJson("/api/v1/patient/{$patient->id}", [
                'name' => $patient->name,
                'phone_number' => '081234567890',
            ])
            ->assertUnprocessable()
            ->assertJsonValidationErrors([
                'province_id',
                'city_or_district_id',
                'subdistrict_id',
                'village_id',
                'facility_id',
            ]);
    }

    /**
     * @return array<string, string>
     */
    private function validPatientProfileAttributes(string $facilityId): array
    {
        return [
            'name' => 'Pasien',
            'phone_number' => '081234567890',
            'birthplace' => 'Aceh',
            'date_of_birth' => '1990-05-15',
            'job' => 'Ibu Rumah Tangga',
            'married_status' => 'married',
            'highest_education' => 'SMA',
            'province_id' => '11',
            'city_or_district_id' => '1101',
            'subdistrict_id' => '1101010',
            'village_id' => '1101010001',
            'address' => 'Jalan Sehat',
            'facility_id' => $facilityId,
        ];
    }

    private function userWithRole(string $slug): User
    {
        $role = Role::query()->create(['name' => $slug, 'slug' => $slug]);

        return User::factory()->create(['role_id' => $role->id]);
    }

    private function createFacility(FacilityType $facilityType, string $name): Facility
    {
        return Facility::query()->create([
            'name' => $name,
            'facility_type_id' => $facilityType->id,
            'province_id' => '11',
            'regency_id' => '1101',
            'district_id' => '1101010',
            'village_id' => '1101010001',
        ]);
    }

    private function seedRegion(): void
    {
        DB::table('provinces')->insert(['id' => '11', 'name' => 'Aceh']);
        DB::table('regencies')->insert(['id' => '1101', 'province_id' => '11', 'name' => 'Kabupaten Simeulue']);
        DB::table('districts')->insert(['id' => '1101010', 'regency_id' => '1101', 'name' => 'Teupah Selatan']);
        DB::table('villages')->insert(['id' => '1101010001', 'district_id' => '1101010', 'name' => 'Lataling']);
    }
}
