<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class AiController extends Controller
{


    public function test()
    {
        try {


            



            return response()->json([
                'message' => 'successfully ai result',
            ], 201);

        } catch (\Exception $error) {
            return response()->json([
                'message' => $error->getMessage()
            ], $error->getCode());
        }
    }
}
