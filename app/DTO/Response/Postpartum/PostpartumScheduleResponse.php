<?php

namespace App\DTO\Response\Postpartum;

class PostpartumScheduleResponse
{
  public ?int $visitNumber;
  public ?string $status;
  public ?string $message;
  public ?bool $canFill;
  public ?string $label;
  public ?string $nextVisitDate;
  public ?string $nextVisitLabel;
  public ?string $birthDate;
}