<?php

namespace App\Service;

use Kreait\Firebase\Contract\Messaging;
use Kreait\Firebase\Messaging\CloudMessage;
use Kreait\Firebase\Messaging\Notification as FcmNotification;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Log;

class FcmService
{
  public function __construct(private Messaging $messaging)
  {
  }

  /**
   * Send a push notification to one or many FCM tokens.
   *
   * @param  string|array<string>  $tokens   Single token or array of tokens
   * @param  string                $title
   * @param  string                $body
   * @param  array<string,string>  $data     Extra key→value pairs carried in the payload
   */
  public function send(
    string|array $tokens,
    string $title,
    string $body,
    array $data = []
  ): void {
    $tokens = collect((array) $tokens)
      ->filter()        // drop nulls / empty strings
      ->unique()
      ->values();

    if ($tokens->isEmpty()) {
      Log::info('[FCM] No tokens to send to — skipping.');
      return;
    }

    $notification = FcmNotification::create($title, $body);

    // Stringify all data values (FCM requirement)
    $stringData = collect($data)
      ->map(fn($v) => (string) $v)
      ->all();

    if ($tokens->count() === 1) {
      $this->sendSingle($tokens->first(), $notification, $stringData);
    } else {
      $this->sendMulticast($tokens, $notification, $stringData);
    }
  }

  /**
   * Convenience: collect FCM tokens from a collection of User models,
   * then send.
   *
   * @param  Collection  $users   Collection of \App\Models\User
   */
  public function sendToUsers(
    Collection $users,
    string $title,
    string $body,
    array $data = []
  ): void {
    $tokens = $users
      ->pluck('fcm_token')
      ->filter()
      ->unique()
      ->values()
      ->all();

    $this->send($tokens, $title, $body, $data);
  }

  /* ── internals ─────────────────────────────────────────────────────── */

  private function sendSingle(
    string $token,
    FcmNotification $notification,
    array $data
  ): void {
    try {
      $message = CloudMessage::new()
        ->toToken($token)
        ->withNotification($notification)
        ->withData($data);

      $this->messaging->send($message);
      Log::info('[FCM] Single message sent.', ['token_prefix' => substr($token, 0, 10)]);
    } catch (\Throwable $e) {
      Log::error('[FCM] Failed to send single message.', [
        'error' => $e->getMessage(),
        'token_prefix' => substr($token, 0, 10),
      ]);
    }
  }

  private function sendMulticast(
    Collection $tokens,
    FcmNotification $notification,
    array $data
  ): void {
    try {
      $message = CloudMessage::new()
        ->withNotification($notification)
        ->withData($data);

      $report = $this->messaging->sendMulticast($message, $tokens->all());

      Log::info('[FCM] Multicast sent.', [
        'success' => $report->successes()->count(),
        'failure' => $report->failures()->count(),
      ]);

      // Log individual failures for debugging
      foreach ($report->failures()->getItems() as $failure) {
        Log::warning('[FCM] Token failed.', [
          'error' => $failure->error()?->getMessage(),
        ]);
      }
    } catch (\Throwable $e) {
      Log::error('[FCM] Multicast failed.', ['error' => $e->getMessage()]);
    }
  }
}
