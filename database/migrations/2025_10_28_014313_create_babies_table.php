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
        Schema::create('babies', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->integer('which_child');
            $table->date('date_of_birth');
            $table->enum('baby_condition', ['healthy', 'premature', 'low_bw', 'nicu']);
            $table->enum('breastfeeding_status', ['exclusive', 'mixed', 'not_breastfeeding']);
            $table->boolean('delivery_complication');

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
        Schema::dropIfExists('babies');
    }
};
