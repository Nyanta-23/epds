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
            $table->enum('parity_count', ['1', '2-4', '>5'])->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('postpartum_visits', function (Blueprint $table) {
            $table->enum('parity_count', ['1x', '2x', '3x'])->change();
        });
    }
};
