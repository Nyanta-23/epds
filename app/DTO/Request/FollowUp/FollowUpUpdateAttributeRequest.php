<?php

namespace App\DTO\Request\FollowUp;


class FollowUpUpdateAttributeRequest
{
  public string $type;
  public string $notes;
  public string $followup_status;
  public string $result_id;
  public string $midiwfe_id;
}
