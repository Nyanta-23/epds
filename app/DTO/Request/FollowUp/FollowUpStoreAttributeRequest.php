<?php

namespace App\DTO\Request\FollowUp;

class FollowUpStoreAttributeRequest
{
  public string $midwife_id;
  public string $result_id;
  public string $type;
  public string $notes;
  public string $followup_status;
}
