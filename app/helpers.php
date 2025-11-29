<?php


if (!function_exists('category_score')) {
  function category_score($score)
  {
    if ($score <= 9) {
      return "Normal";
    } elseif ($score >= 10 && $score <= 12) {
      return "Low Risk";
    } else {
      return "High Risk";
    }
  }
}


if (!function_exists('interpreted_score')) {
  function interpreted_score($score)
  {
    if ($score <= 9) {
      return "No depression / Normal";
    } elseif ($score >= 10 && $score <= 12) {
      return "Further monitoring needed";
    } elseif ($score >= 13 && $score <= 19) {
      return "Consider referral to psychologist/psychiatrist";
    } else {
      return "Immediate referral to mental health professional";
    }
  }
}


if (!function_exists('category_baby_condition')) {
  function category_baby_condition($value)
  {
    if ($value == 0) {
      return [
        'value' => $value,
        'cateogry' => 'Sehat'
      ];
    } else if ($value == 1) {
      return [
        'value' => $value,
        'category' => "Prematur"
      ];
    } else if ($value == 2) {
      return [
        'value' => $value,
        'category' => "Berat badan rendah"
      ];
    } else if ($value == 3) {
      return [
        'value' => $value,
        'category' => 'Neonatal Intesive Care Unit'
      ];
    }
  }

  if (!function_exists('category_typeof_delivery')) {
    function category_typeof_delivery($value)
    {
      switch ($value) {
        case 0:
          return [
            'value' => $value,
            'category' => "normal"
          ];
        case 1:
          return [
            'value' => $value,
            'category' => 'operasi caesar'
          ];
        case 2:
          return [
            'value' => $value,
            'category' => 'forsep'
          ];
      }
    }
  }
}

