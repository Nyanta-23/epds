<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
  /**
   * Run the migrations.
   * 
   * Strategy for soft-delete aware unique constraint:
   * Use generated column + unique index for MySQL 5.7.7+
   * 
   * When deleted_at IS NULL:
   *   email_for_unique_check = email (stored)
   * When deleted_at IS NOT NULL:
   *   email_for_unique_check = NULL (soft-deleted, email can be reused)
   */
  public function up(): void
  {
    Schema::table('users', function (Blueprint $table) {
      // Drop old email unique constraint
      $table->dropUnique(['email']);

      // Add generated column that is NULL when soft-deleted
      // Only active emails will have a value, allowing reuse of deleted emails
      $table->string('email_unique')->nullable()->after('email');

      // Create unique constraint on this column
      // NULL values don't conflict with each other in unique constraints
      $table->unique(['email_unique']);
    });

    // Populate email_unique with email where deleted_at is NULL
    \DB::update(
      'UPDATE users SET email_unique = email WHERE deleted_at IS NULL'
    );
  }

  /**
   * Reverse the migrations.
   */
  public function down(): void
  {
    Schema::table('users', function (Blueprint $table) {
      // Drop the unique constraint on email_unique
      $table->dropUnique(['email_unique']);

      // Drop the new column
      $table->dropColumn('email_unique');

      // Restore original unique constraint on email
      $table->unique(['email']);
    });
  }
};
