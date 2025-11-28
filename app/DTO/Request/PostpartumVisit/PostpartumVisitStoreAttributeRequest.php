<?php

namespace App\DTO\Request\PostpartumVisit;


class PostpartumVisitStoreAttributeRequest
{
  public string $id;
  public int $visit_number;
  public string $date_filled;

  public int $sleep_quality;
  public int $partner_support;
  public int $family_economy;

  public bool $live_with_partner;
  public bool $psych_history;
  public bool $psych_treatment;
  public bool $psych_trauma;

  public bool $preg_comp_history;
  public bool $last_comp;
  public ?string $last_comp_note;

  public string $parity_count;

  public bool $baby_healthy;
  public int $baby_caregiver;

  public int $feed_type;

  public string $mother_id;
}
