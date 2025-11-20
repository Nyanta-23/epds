import { FollowUpStatusEnum } from "./enum";

export interface Enum {
  value: number;
  label: string;
  label_id: string;
}

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

  babies: Baby[];
}

export interface Baby {
  id: string;
  which_child: number;
  date_of_birth: string;
  baby_condition: string;
  baby_condition_label: string;
  typeof_delivery: string;
  typeof_delivery_label: string;
  gender: string;
  mother: Patient;
}

export interface Question {
  id: string;
  number_question: string;
  question: string;

  options: OptionQuestion[];
}

export interface OptionQuestion {
  id: string;
  option: string;
  option_text: string;
  value: number;

  question: Question;
}


export interface PostpartumVisit {
  id: string;
  visit_number: number;
  date_filled: string;

  sleep_quality: Enum;
  partner_support: Enum;
  live_with_partner: boolean;
  family_economy: Enum;

  psych_history: boolean;
  psych_treatment: boolean;
  psych_trauma: boolean;

  parity_count: string;
  preg_comp_history: boolean;

  last_comp: boolean;
  last_comp_note: string | null;

  baby_healthy: boolean;
  baby_caregiver: Enum;

  feed_type: Enum;

  mother: Patient;
  result: Result;
  answers: Answer[];

}

export interface Result {
  id: string;
  total_score: number;
  followup_status: Enum;
  postpartum_visit: PostpartumVisit;
  follow_up: FollowUp;
}

export interface Answer {
  id: string;
  answer: string;
  postpartum_visit: PostpartumVisit;
  question: Question;
}


export interface FollowUp {
  id: string;
  type: Enum;
  notes: string;
  date_filled: string;
  mdiwife: Patient;
  result: Result;
}


export interface RecomendationRule {
  id: string;
  name: string;
  description: string;
  min_score: number;
  max_score: number;
  // tambahin type
}

export interface RecomendationVariation {
  id: string;
  recomendation_text: string;
  generated_at: string;
  recomendation_rule: RecomendationRule;
}