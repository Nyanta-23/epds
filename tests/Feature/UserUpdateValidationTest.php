<?php

namespace Tests\Feature;

use App\Models\Facility;
use App\Models\FacilityType;
use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Tests\TestCase;

class UserUpdateValidationTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_be_created_with_a_facility_when_region_fields_are_optional(): void
    {
        $actor = $this->userWithRole('super_admin');
        $role = Role::query()->create(['name' => 'admin', 'slug' => 'admin']);
        $facility = $this->facility();

        $this->actingAs($actor)
            ->post(route('user.store'), [
                'name' => 'Admin Fasilitas',
                'email' => 'admin.fasilitas@example.test',
                'password' => 'Password123!',
                'role_id' => $role->id,
                'facility_id' => $facility->id,
            ])
            ->assertRedirect(route('user'))
            ->assertSessionHasNoErrors();

        $this->assertDatabaseHas('users', [
            'email' => 'admin.fasilitas@example.test',
            'facility_id' => $facility->id,
            'city_or_district' => null,
            'subdistrict' => null,
        ]);
    }

    public function test_midwife_can_be_created_without_legacy_work_region_fields(): void
    {
        $actor = $this->userWithRole('super_admin');
        $role = Role::query()->create(['name' => 'Bidan', 'slug' => 'midwife']);
        $facility = $this->facility();

        $this->actingAs($actor)
            ->post(route('user.store'), [
                'name' => 'Bidan Fasilitas',
                'email' => 'bidan.fasilitas@example.test',
                'password' => 'Password123!',
                'role_id' => $role->id,
                'facility_id' => $facility->id,
            ])
            ->assertRedirect(route('user'))
            ->assertSessionHasNoErrors();

        $this->assertDatabaseHas('users', [
            'email' => 'bidan.fasilitas@example.test',
            'facility_id' => $facility->id,
            'province_id' => null,
            'city_or_district_id' => null,
            'subdistrict_id' => null,
            'village_id' => null,
        ]);
    }

    public function test_midwife_creation_requires_a_facility_assignment(): void
    {
        $actor = $this->userWithRole('super_admin');
        $role = Role::query()->create(['name' => 'Bidan', 'slug' => 'midwife']);

        $this->actingAs($actor)
            ->from(route('user.create'))
            ->post(route('user.store'), [
                'name' => 'Bidan Tanpa Fasilitas',
                'email' => 'bidan.tanpa.fasilitas@example.test',
                'password' => 'Password123!',
                'role_id' => $role->id,
            ])
            ->assertRedirect(route('user.create'))
            ->assertSessionHasErrors('facility_id');
    }

    public function test_user_can_be_assigned_a_facility_without_changing_their_email(): void
    {
        $actor = $this->userWithRole('super_admin');
        $target = $this->userWithRole('admin');
        $facility = $this->facility();

        $this->actingAs($actor)
            ->put(route('user.update', $target), [
                'name' => $target->name,
                'email' => $target->email,
                'role_id' => $target->role_id,
                'facility_id' => $facility->id,
            ])
            ->assertRedirect(route('user'))
            ->assertSessionHasNoErrors();

        $this->assertSame($facility->id, $target->fresh()->facility_id);
        $this->assertSame($target->email, $target->fresh()->email);
    }

    public function test_user_update_still_rejects_an_email_used_by_another_user(): void
    {
        $actor = $this->userWithRole('super_admin');
        $target = $this->userWithRole('admin');
        $otherUser = $this->userWithRole('admin');

        $this->actingAs($actor)
            ->from(route('user.edit', $target))
            ->put(route('user.update', $target), [
                'name' => $target->name,
                'email' => $otherUser->email,
                'role_id' => $target->role_id,
            ])
            ->assertRedirect(route('user.edit', $target))
            ->assertSessionHasErrors('email');
    }

    private function userWithRole(string $slug): User
    {
        $role = Role::query()->create(['name' => $slug, 'slug' => $slug]);

        return User::factory()->create(['role_id' => $role->id]);
    }

    private function facility(): Facility
    {
        DB::table('provinces')->insert(['id' => '11', 'name' => 'Aceh']);
        DB::table('regencies')->insert(['id' => '1101', 'province_id' => '11', 'name' => 'Simeulue']);
        DB::table('districts')->insert(['id' => '1101010', 'regency_id' => '1101', 'name' => 'Teupah Selatan']);
        DB::table('villages')->insert(['id' => '1101010001', 'district_id' => '1101010', 'name' => 'Lataling']);

        $facilityType = FacilityType::query()->create(['name' => 'Puskesmas']);

        return Facility::query()->create([
            'name' => 'Puskesmas Contoh',
            'facility_type_id' => $facilityType->id,
            'province_id' => '11',
            'regency_id' => '1101',
            'district_id' => '1101010',
            'village_id' => '1101010001',
        ]);
    }
}
