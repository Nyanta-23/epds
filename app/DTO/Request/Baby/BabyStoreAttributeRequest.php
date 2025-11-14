<?php

namespace App\DTO\Request\Baby;

class BabyStoreAttributeRequest
{
  public int $which_child;
  public string $date_of_birth;
  public int $baby_condition;
  public int $typeof_delivery;
  public string $gender;
  public string $mother_id;
}
