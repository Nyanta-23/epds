<?php

namespace App\DTO\Request\FollowUp;


class FollowUpUpdateAttributeRequest
{
  public int $type;
  public string $notes;
  public int $followup_status;
  public string $result_id;
  public string $midwife_id;
}
