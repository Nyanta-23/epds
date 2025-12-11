<?php

namespace App\Http\Controllers;

use App\Models\User;
use Auth;
use Illuminate\Auth\Events\Verified;
use Illuminate\Http\Request;
use Inertia\Inertia;


class AuthController extends Controller
{
  public function destroy(Request $request)
        {
            Auth::guard('web')->logout();

            $request->session()->invalidate();

            $request->session()->regenerateToken();

        }

public function verify(Request $request)
  {
    $user = User::findOrFail($request->route('id'));

    if (!hash_equals((string) $request->route('hash'), sha1($user->getEmailForVerification()))) {
      abort(403, 'Link verifikasi tidak valid atau rusak.');
    }

    if (!$user->hasVerifiedEmail()) {
      $user->markEmailAsVerified();

      event(new Verified($user));
    }

    $token = $user->createToken('token')->plainTextToken;

    $deepLink = "epds://auth/callback?token=" . $token . "&email=" . $user->email;

    return Inertia::render('auth/verification-success', [
      'id' => $user->id,
      'token' => $token,
      'email' => $user->email,
      'name' => $user->name,
      'deepLink' => $deepLink
    ]);
  }
}