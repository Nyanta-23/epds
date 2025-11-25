<?php

namespace App\Http\Controllers\Api;

use Exception;

class PostpartumVisitAnswerController extends Controller
{

  public function store()
  {

    try {


      

    } catch (Exception $error) {
      
      Log::error('store_postpartum_vist_answer', ['error' => $error->getMessage()]);
      return response()->json([
        'message' => $error->getMessage()
      ], $error->getCode());
      
    }
  }
}
