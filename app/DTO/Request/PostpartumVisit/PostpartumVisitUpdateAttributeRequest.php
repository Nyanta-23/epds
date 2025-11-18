<?php

namespace App\DTO\Request\PostpartumVisit;

class PostpartumVisitUpdateAttributeRequest
{
  public int $visit_number;
  public string $date_filled;

  public string $sleep_quality;
  public string $partner_support;
  public bool $live_with_partner;
  public string $family_economy;

  public bool $psych_history;
  public bool $psych_treatment;
  public bool $psych_trauma;

  public string $parity_count;
  public bool $preg_comp_history;

  public bool $last_comp;
  public ?string $last_comp_note;

  public bool $baby_healthy;
  public string $baby_caregiver;

  public string $feed_type;
}
