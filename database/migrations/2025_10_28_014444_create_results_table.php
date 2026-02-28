<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
  /**
   * Run the migrations.
   */
  public function up(): void
  {
    Schema::create('results', function (Blueprint $table) {
      $table->uuid('id')->primary();

      $table->integer('total_score');
      // $table->enum('followup_status', ['belum_ada_tindakan', 'tpmb', 'refer_psychologist', 'refer_psyichiatrist'])->default('belum_ada_tindakan');
      $table->unsignedTinyInteger('followup_status')->comment('0: belum_ada_tindakan, 1: tpmb, 2: refer_psychologist, 3: refer_psyichiatrist');

      $table->foreignUuid('postpartum_visit_id')
        ->unique()
        ->references('id')
        ->on('postpartum_visits')
        ->onUpdate('cascade')
        ->onDelete('cascade');


      $table->foreignUuid('followup_id')
        ->unique()
        ->nullable()
        ->references('id')
        ->on('followups')
        ->onUpdate('cascade')
        ->onDelete('cascade');

      $table->timestamps();
    });
  }

  /**
   * Reverse the migrations.
   */
  public function down(): void
  {
    Schema::dropIfExists('results');
  }
};
