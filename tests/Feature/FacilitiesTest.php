<?php

namespace Tests\Feature;

use App\Models\Facility;
use App\Models\FacilityType;
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

    private function userWithRole(string $slug): User
    {
        $role = Role::query()->create(['name' => $slug, 'slug' => $slug]);

        return User::factory()->create(['role_id' => $role->id]);
    }

    private function seedRegion(): void
    {
        DB::table('provinces')->insert(['id' => '11', 'name' => 'Aceh']);
        DB::table('regencies')->insert(['id' => '1101', 'province_id' => '11', 'name' => 'Kabupaten Simeulue']);
        DB::table('districts')->insert(['id' => '1101010', 'regency_id' => '1101', 'name' => 'Teupah Selatan']);
        DB::table('villages')->insert(['id' => '1101010001', 'district_id' => '1101010', 'name' => 'Lataling']);
    }
}
