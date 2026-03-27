<?php

namespace App\Http\Requests\PostpartumVisit;

use Illuminate\Foundation\Http\FormRequest;

class PostpartumVisitUpdateRequestValidator extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'visit_number'       => ['required', 'integer', 'min:1'],
            'date_filled'        => ['required', 'date'],

            'sleep_quality'      => ['required', 'string'],
            'partner_support'    => ['required', 'string'],
            'live_with_partner'  => ['required', 'boolean'],
            'family_economy'     => ['required', 'string'],

            'psych_history'      => ['required', 'boolean'],
            'psych_treatment'    => ['required', 'boolean'],
            'psych_trauma'       => ['required', 'boolean'],
            'feel_unsafe'        => ['required', 'string'],

            'parity_count'       => ['required', 'string'],
            'preg_comp_history'  => ['required', 'boolean'],
            'pregnancy_planned'  => ['required', 'string'],

            'last_comp'          => ['required', 'boolean'],
            'last_comp_note'     => ['nullable', 'string'],

            'baby_healthy'       => ['required', 'boolean'],
            'baby_caregiver'     => ['required', 'string'],

            'feed_type'          => ['required', 'string'],
        ];
    }
}
