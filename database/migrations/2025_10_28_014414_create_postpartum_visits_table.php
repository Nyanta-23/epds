<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('postpartum_visits', function (Blueprint $table) {
            $table->uuid('id')->primary();

            $table->date('date_filled');
            $table->enum('sleep_quality', ['good', 'poor', 'frequently_awake']);
            $table->enum('support_level', ['good', 'fair', 'poor']);
            $table->boolean('socioeconomic_issues');
            $table->boolean('psych_history');
            $table->enum('followup_status', ['not_counsuled', 'counsuled', 'refer_psychologist', 'refer_psyichiatrist'])->default('not_counsuled');

            $table->foreignUuid('mother_id')
                ->references('id')
                ->on('users')
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
        Schema::dropIfExists('postpartum_visits');
    }
};
