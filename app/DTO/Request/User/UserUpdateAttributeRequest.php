<?php

namespace App\DTO\Request\User;

class UserUpdateAttributeRequest
{
  public string $name;
  // public ?string $email;
  public string $role_id;
  public ?string $province_id;
  public ?string $regency_id;
  public ?string $district_id;
  public ?string $village_id;
  public ?string $village;
  public ?string $province;
  public ?string $city_or_district;
  public ?string $subdistrict;
}
