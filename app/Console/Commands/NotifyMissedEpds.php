<?php

namespace App\Console\Commands;

use App\Models\PostpartumVisit;
use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Notifications\Notifiable;

class NotifyMissedEpds extends Command
{
  /**
   * The name and signature of the console command.
   *
   * @var string
   */
  protected $signature = 'notify:missed-epds {--force}';

  /**
   * The description of the console command.
   *
   * @var string
   */
  protected $description = 'Create notifications for missed EPDS schedules (terlewat lebih dari 1 hari)';

  /**
   * Execute the console command.
   */
  public function handle()
  {
    try {
      $force = $this->option('force');
      $today = now()->subDay(); // Terlewat > 1 hari dari jadwal

      // Query: PostpartumVisit yang date_filled <= yesterday dan belum ada Result
      $missedVisits = PostpartumVisit::query()
        ->whereDate('date_filled', '<=', $today)
        ->whereDoesntHave('result')
        ->with(['mother', 'baby'])
        ->orderBy('date_filled', 'asc')
        ->get();

      if ($missedVisits->isEmpty()) {
        $this->info('✓ No missed EPDS schedules found.');
        return self::SUCCESS;
      }

      $this->info("Found {$missedVisits->count()} missed EPDS schedules.");

      $createdCount = 0;
      $skippedCount = 0;

      foreach ($missedVisits as $visit) {
        // Get target recipients (midwife assigned + admins)
        $recipients = $this->getNotificationRecipients($visit);

        if ($recipients->isEmpty()) {
          $this->warn("  ⊘ No recipients for visit {$visit->id} (mother: {$visit->mother?->name})");
          $skippedCount++;
          continue;
        }

        foreach ($recipients as $user) {
          // Check idempotency: don't create duplicate notifications
          $existingNotif = \DB::table('notifications')
            ->where('type', \App\Notifications\MissedEpdsNotification::class)
            ->where('notifiable_type', User::class)
            ->where('notifiable_id', $user->id)
            ->whereJsonContains('data->postpartum_visit_id', $visit->id)
            ->first();

          if ($existingNotif && !$force) {
            $skippedCount++;
            continue;
          }

          // Create notification
          $user->notify(new \App\Notifications\MissedEpdsNotification($visit));
          $createdCount++;

          $this->line("  ✓ Notified {$user->name} ({$user->email}) - Visit: {$visit->id}");
        }
      }

      $this->info("Completed: {$createdCount} created, {$skippedCount} skipped.");
      return self::SUCCESS;

    } catch (\Exception $e) {
      $this->error("Error: {$e->getMessage()}");
      \Log::error('NotifyMissedEpds command error', [
        'message' => $e->getMessage(),
        'trace' => $e->getTraceAsString(),
      ]);
      return self::FAILURE;
    }
  }

  /**
   * Determine which users should be notified for a missed PostpartumVisit.
   * Recipients: Admins + Super admins + assigned midwife (if any)
   */
  private function getNotificationRecipients(PostpartumVisit $visit)
  {
    // 1. Admins & Super admins
    $admins = User::query()
      ->whereHas('role', fn(Builder $q) => $q->whereIn('slug', ['admin', 'super_admin']))
      ->get();

    // 2. Midwife who filled the visit (if any)
    $midwives = collect([]);
    if ($visit->baby && $visit->baby->midwife_id) {
      $midwife = User::find($visit->baby->midwife_id);
      if ($midwife) {
        $midwives->push($midwife);
      }
    }

    // 3. Mother herself (ibu) as well - optional
    if ($visit->mother) {
      // If you want to notify the mother/patient too, uncomment:
      // $admins->push($visit->mother);
    }

    return $admins->merge($midwives)->unique('id');
  }
}
