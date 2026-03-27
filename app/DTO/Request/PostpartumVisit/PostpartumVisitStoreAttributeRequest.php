<?php

namespace App\DTO\Request\PostpartumVisit;

use App\Enums\BabyConditionEnum;
use App\Enums\FeedTyperEnum;


class PostpartumVisitStoreAttributeRequest
{
  public string $id;
  public int $visit_number;
  public string $date_filled;

  public int $sleep_quality;
  public int $partner_support;

  public int $family_salary_permonth;
  public int $dependent_family_count;
  public int $is_salary_sufficient;

  public bool $live_with_partner;
  public bool $psych_history;
  public bool $psych_treatment;
  public bool $psych_trauma;
  public string $feel_unsafe;

  public bool $preg_comp_history;
  public string $pregnancy_planned;
  public bool $last_comp;
  public ?string $last_comp_note;

  public string $parity_count;

  public BabyConditionEnum $baby_healthy;
  public array $baby_caregiver;

  public FeedTyperEnum $feed_type;

  public string $mother_id;

  public string $baby_id;
}
