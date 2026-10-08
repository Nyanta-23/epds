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
            $table->foreignUuid('facility_id')
                ->nullable()
                ->after('mother_id')
                ->constrained('facilities')
                ->restrictOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('postpartum_visits', function (Blueprint $table) {
            $table->dropConstrainedForeignId('facility_id');
        });
    }
};
