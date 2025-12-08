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

            $table->integer('visit_number');

            $table->date('date_filled');
            // $table->enum('sleep_quality', ['good', 'poor', 'frequently_awake']);
            $table->unsignedTinyInteger('sleep_quality')->comment('0: kurang dari 3 Jam, 1: 3-4j am, 2: 5-6 jam');

            // $table->enum('partner_support', ['good', 'fair', 'poor']);
            $table->unsignedTinyInteger('partner_support')->comment('0: good, 1: fair, 2: poor');

            $table->unsignedTinyInteger('family_salary_permonth');
            $table->unsignedTinyInteger('dependent_family_count')->comment('0: 1-2, 1: 3-4, 2: >5');
            $table->unsignedTinyInteger('is_salary_sufficient')->comment('0: insufficient, 1: sufficient for basic needs, 2: sufficient for comfort');
            $table->boolean('live_with_partner');

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
            // $table->unsignedTinyInteger('parity_group');

            $table->enum('parity_count', ['1x', '2x', '3x', '>3x']);


            $table->boolean('baby_healthy');
            // 1=Partner, 2=Parents, 3=Family/Nanny, 4=None
            $table->unsignedTinyInteger('baby_caregiver')->comment('0: partner, 1: parents, 2: family/nanny, 3: none');

            $table->unsignedTinyInteger('feed_type')->comment('0: exclusive, 1: mixed, 2: formula');

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
