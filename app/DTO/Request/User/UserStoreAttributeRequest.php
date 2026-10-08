<?php

namespace App\DTO\Request\User;

class UserStoreAttributeRequest
{
    public string $name;

    public string $email;

    public string $password;

    public string $role_id;

    public ?string $facility_id = null;

    public ?string $province_id = null;

    public ?string $regency_id = null;

    public ?string $district_id = null;

    public ?string $village_id = null;

    public ?string $province = null;

    public ?string $city_or_district = null;

    public ?string $subdistrict = null;

    public ?string $village = null;

    public ?string $instansi = null;

    public ?string $nama_instansi = null;
}
