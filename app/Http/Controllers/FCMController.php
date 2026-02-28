<?php

namespace App\Http\Controllers;

use Exception;
use Illuminate\Http\Request;

class FCMController extends Controller
{

  public function saveToken(Request $request)
  {
    try {
      $request->validate(['token' => 'required|string']);
      $user = auth()->user();
      $user->fcm_token = $request->token;
      $user->save();
      return response()->json(['message' => 'Token saved successfully']);
    } catch (Exception $error) {
      return response()->json(['message' => 'Failed to save token'], 500);

    }
  }

}


