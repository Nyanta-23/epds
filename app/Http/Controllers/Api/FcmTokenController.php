<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class FcmTokenController extends Controller
{
  /**
   * Store or refresh the authenticated user's FCM device token.
   *
   * POST /api/v1/fcm-token
   * Body: { "fcm_token": "<token>" }
   */
  public function store(Request $request): JsonResponse
  {
    $request->validate([
      'fcm_token' => ['required', 'string', 'max:512'],
    ]);

    $request->user()->update([
      'fcm_token' => $request->fcm_token,
    ]);

    return response()->json(['message' => 'FCM token saved.']);
  }

  /**
   * Remove the token (e.g. on logout).
   *
   * DELETE /api/v1/fcm-token
   */
  public function destroy(Request $request): JsonResponse
  {
    $request->user()->update(['fcm_token' => null]);

    return response()->json(['message' => 'FCM token removed.']);
  }
}
