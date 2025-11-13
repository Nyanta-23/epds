export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
}

export interface Role {
  id: string;
  name: string;
  slug: string;
  permissions: Permission[];
}

export interface Permission {
  id: string;
  name: string;
  slug: string;
  roles: Role[];
}

export interface Patient {
  id: string;
  name: string;
  phone_number: string;
  birthplace: string;
  date_of_birth: string;
  job: string;
  married_status: string;
  highest_education: string;
  province: string;
  city_or_district: string;
  subdistrict: string;
  village: string;
  
  province_id: string;
  city_or_district_id: string;
  subdistrict_id: string;
  village_id: string;

  address: string;
  is_verified: boolean;
  is_can_visit: boolean;
}