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
            // $table->enum('sleep_quality', ['good', 'poor', 'frequently_awake']);
            $table->unsignedTinyInteger('sleep_quality');

            // $table->enum('partner_support', ['good', 'fair', 'poor']);
            $table->unsignedTinyInteger('partner_support');

            $table->boolean('live_with_partner');

            // $table->enum('family_economy', ['good', 'fair', 'poor']);
            $table->unsignedTinyInteger('family_economy');

            $table->boolean('psych_history');
            $table->boolean('psych_treatment');
            $table->boolean('psych_trauma');

            $table->boolean('last_comp');
            $table->text('last_comp_note')->nullable();

            $table->boolean('preg_comp_history');
            // 	1x
            // 	2x
            // 	3x
            // 	Lebih dari 3x
            $table->unsignedTinyInteger('parity_group');
            $table->unsignedTinyInteger('parity_count')->nullable();

            $table->boolean('baby_healthy');
            // 1=Partner, 2=Parents, 3=Family/Nanny, 4=None
            $table->unsignedTinyInteger('baby_caregiver');

            $table->unsignedTinyInteger('feed_type');

            $table->softDeletes();

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
