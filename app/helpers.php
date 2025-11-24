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
