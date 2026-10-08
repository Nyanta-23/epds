<?php

namespace Database\Seeders;

use DB;
use Illuminate\Database\Seeder;

class FacilitySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('facility_types')->insert([
            [
                'id' => uuid_create(),
                'name' => 'Puskesmas',
                'is_deleted' => false,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => uuid_create(),
                'name' => 'Rumah Sakit',
                'is_deleted' => false,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => uuid_create(),
                'name' => 'TPMB',
                'is_deleted' => false,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);

        DB::table('facilities')->insert([
            [
                'id' => uuid_create(),
                'facility_type_id' => DB::table('facility_types')->where('name', 'Puskesmas')->value('id'),
                'parent_id' => null,
                'name' => 'Puskesmas A',
                'province_id' => '11',
                'regency_id' => '1101',
                'district_id' => '1101010',
                'village_id' => '1101010001',
                'is_deleted' => false,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => uuid_create(),
                'facility_type_id' => DB::table('facility_types')->where('name', 'Rumah Sakit')->value('id'),
                'parent_id' => null,
                'name' => 'Rumah Sakit B',
                'province_id' => '11',
                'regency_id' => '1101',
                'district_id' => '1101010',
                'village_id' => '1101010001',
                'is_deleted' => false,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
