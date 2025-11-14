<?php

namespace App\DTO\Request\Patient;

class PatientUpdateAttributeRequest
{
  public string $name;
  public string $phone_number;
  public string $birthplace;
  public string $date_of_birth;
  public string $job;
  public string $married_status;
  public string $highest_education;
  public string $province;
  public string $city_or_district;
  public string $subdistrict;
  public string $village;

  public string $province_id;
  public string $city_or_district_id;
  public string $subdistrict_id;
  public string $village_id;

  public ?string $address = null;
}
