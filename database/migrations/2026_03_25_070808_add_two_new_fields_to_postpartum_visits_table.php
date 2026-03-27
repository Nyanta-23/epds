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
        Schema::table('postpartum_visits', function (Blueprint $table) {
            $table->tinyInteger('feel_unsafe')->nullable();
            $table->tinyInteger('pregnancy_planned')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('postpartum_visits', function (Blueprint $table) {
            $table->dropColumn(['feel_unsafe', 'pregnancy_planned']);
        });
    }
};
