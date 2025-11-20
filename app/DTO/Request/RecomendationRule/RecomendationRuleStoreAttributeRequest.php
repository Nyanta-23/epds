<?php

namespace App\DTO\Request\RecomendationRule;

class RecomendationRuleStoreAttributeRequest
{
  public string $name;
  public string $description;
  public int $min_score;
  public int $max_score;
}
