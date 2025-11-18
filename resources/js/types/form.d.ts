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

export interface FormBaby {
  which_child: number;
  date_of_birth: string;
  baby_condition: string;
  typeof_delivery: string;
  gender: string;
  mother_id: string;
  [key: string]: any;
}

export interface FormQuestion {
  number_question: string;
  question: string;
  [key: string]: any;
}

export interface FormOptionQuestion {
  option: string;
  option_text: string;
  value: number;
  [key: string]: any;
}

export interface FormPostpartumVisit {
    visit_number: number;
    date_filled: string;
  
    sleep_quality: string;
    partner_support: string;
    live_with_partner: boolean;
    family_economy: string;
  
    psych_history: boolean;
    psych_treatment: boolean;
    psych_trauma: boolean;
  
    parity_count: string;
    preg_comp_history: boolean;
  
    last_comp: boolean;
    last_comp_note: string | null;
  
    baby_healthy: boolean;
    baby_caregiver: string;
  
    feed_type: string;

    [key: string]: any;
}