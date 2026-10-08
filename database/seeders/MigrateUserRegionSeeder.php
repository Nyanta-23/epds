<?php

namespace Database\Seeders;

use App\Models\District;
use App\Models\Province;
use App\Models\Regency;
use App\Models\User;
use App\Models\Village;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Log;

class MigrateUserRegionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $userData = [];
        User::chunk(50, function ($users) use (&$userData) {
            foreach ($users as $user) {
                $province = Province::where('name', $user->province)->first();
                $regency = Regency::where('name', $user->city_or_district)->first();
                $district = District::where('name', $user->subdistrict)->first();
                $village = Village::where('name', $user->village)->first();

                $userData[] = [
                    'id' => $user->id,
                    'province_id' => $province ? (string) $province->id : null,
                    'regency_id' => $regency ? (string) $regency->id : null,
                    'district_id' => $district ? (string) $district->id : null,
                    'village_id' => $village ? (string) $village->id : null,
                ];
            }
        });

        $filteredUserData = array_values(array_filter($userData, function ($data) {
            return $data['province_id'] !== null;
        }));

        foreach ($filteredUserData as $data) {

            if ($data['province_id'] === null || $data['regency_id'] === null || $data['district_id'] === null || $data['village_id'] === null) {
                continue;
            }

            User::where('id', $data['id'])->update([
                'province_migrate_id' => $data['province_id'],
                'regency_migrate_id' => $data['regency_id'],
                'district_migrate_id' => $data['district_id'],
                'village_migrate_id' => $data['village_id'],
            ]);
            Log::info('User ' . $data['id'] . ' region data migrated successfully.');
        }
    }
}
