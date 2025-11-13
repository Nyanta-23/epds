export interface FormUser {
  name: string;
  email: string;
  role_id: string;
  password?: string;
  password_confirmation?: string;
  [key: string]: any;
}

export interface FormPatient {
  name: string; // input
  phone_number: string; // input
  birthplace: string; // input
  date_of_birth: string; // date
  job: string; // input
  married_status: string; // select
  highest_education: string; // select
  province: string; // select api
  city_or_district: string; // select api 
  subdistrict: string; // select api
  village: string; // select api
  address: string; // text
  [key: string]: any;
}