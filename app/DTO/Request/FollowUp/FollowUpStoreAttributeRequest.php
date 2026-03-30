<?php

namespace App\DTO\Request\FollowUp;

class FollowUpStoreAttributeRequest
{
  public string $postpartum_visit_id;
  public string $midwife_id;
  public string $result_id;
  public int $type;
  public string $notes;
  public int $followup_status;
}
