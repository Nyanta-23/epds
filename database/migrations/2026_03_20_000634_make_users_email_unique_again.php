<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
  /**
   * Run the migrations.
   * 
   * Revert email to simple unique constraint (no email reuse feature)
   */
  public function up(): void
  {
    Schema::table('users', function (Blueprint $table) {
      // Drop the email_unique column and its constraint
      $table->dropUnique(['email_unique']);
      $table->dropColumn('email_unique');

      // Make email unique again
      $table->unique(['email']);
    });
  }

  /**
   * Reverse the migrations.
   */
  public function down(): void
  {
    Schema::table('users', function (Blueprint $table) {
      // Drop the unique constraint on email
      $table->dropUnique(['email']);

      // Add email_unique column back
      $table->string('email_unique')->nullable()->after('email');
      $table->unique(['email_unique']);

      // Populate email_unique with email where deleted_at is NULL
      \DB::update(
        'UPDATE users SET email_unique = email WHERE deleted_at IS NULL'
      );
    });
  }
};
