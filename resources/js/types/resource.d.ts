export interface Enum {
    value: number;
    label: string | List;
    label_id: string | List;
}

export interface User {
    id: string;
    name: string;
    email: string;
    role: Role;
    province_id: string;
    regency_id: string;
    district_id: string;
    village_id: string;
    province: string;
    city_or_district: string;
    subdistrict: string;
    village: string;
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

    number_patient: string;

    babies: Baby[];
}

export interface Baby {
    id: string;
    which_child: number;
    date_of_birth: string;
    baby_condition: number;
    baby_condition_label: string;
    typeof_delivery: number;
    typeof_delivery_label: string;
    gender: string;
    mother: Patient | null;
    baby_feeding_method_label: string;
    baby_feeding_method: number;
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
    family_salary_permonth: Enum;

    psych_history: boolean;
    psych_treatment: boolean;
    psych_trauma: boolean;
    dependent_family_count: Enum;
    is_salary_sufficient: Enum;
    parity_count: string;
    preg_comp_history: boolean;

    last_comp: boolean | number;
    last_comp_note: string | null;

    baby_healthy: Enum;
    baby_caregiver: Enum;

    feed_type: Enum;

    mother: Patient | null;
    result: Result | null;
    answers: Answer[];
    followup: FollowUp;
}

export interface Result {
    id: string;
    total_score: number;
    followup_status: Enum;
    postpartum_visit: PostpartumVisit;
    follow_up: FollowUp;
    followup: FollowUp;
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

export interface Region {
    id: string;
    name: string | null;
}
