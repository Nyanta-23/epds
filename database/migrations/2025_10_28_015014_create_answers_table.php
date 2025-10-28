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
        Schema::create('answers', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->char('answer', 1);

            $table->foreignUuid('postpartum_visit_id')
                ->references('id')
                ->on('postpartum_visits')
                ->onUpdate('cascade')
                ->onDelete('cascade');

            $table->foreignUuid('question_id')
                ->references('id')
                ->on('questions')
                ->onUpdate('restrict')
                ->onDelete('restrict');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('answers');
    }
};
