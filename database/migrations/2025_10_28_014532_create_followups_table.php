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
        Schema::create('followups', function (Blueprint $table) {
            $table->uuid('id')->primary();

            $table->enum('type', ['education', 'reference', 'monitoring']);
            // $table->enum('followup_status', ['not_counsuled', 'counsuled', 'refer_psychologist', 'refer_psyichiatrist'])->default('not_counsuled');
            $table->text('notes');
            $table->dateTime('date_filled');

            $table->foreignUuid('result_id')
                ->references('id')
                ->on('results')
                ->onUpdate('cascade')
                ->onDelete('cascade');

            $table->foreignUuid('midwife_id')
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
        Schema::dropIfExists('followups');
    }
};
