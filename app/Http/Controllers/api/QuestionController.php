<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\QuestionResource;
use App\Service\Question\QuestionService;
use Exception;

class QuestionController extends Controller
{
  public function __construct(private QuestionService $questionService)
  {

  }
  public function index()
  {
    try {
      $response = $this->questionService->index();

      return response()->json([
        'message' => "question result",
        'data'=> QuestionResource::collection($response)
      ]);
    }catch(Exception $error) {
      return response()->json([
        'message' => $error->getMessage(),
        'data' => null
      ]);
    }
  }
}