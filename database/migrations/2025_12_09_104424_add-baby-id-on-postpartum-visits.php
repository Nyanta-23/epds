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
        if (!Schema::hasColumn('postpartum_visits', 'baby_id')) {
            Schema::table('postpartum_visits', function (Blueprint $table) {
                $table->unsignedBigInteger('baby_id')->nullable()->after('mother_id');

                $table->foreign('baby_id')->references('id')->on('babies')->onDelete('set null');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (Schema::hasColumn('postpartum_visits', 'baby_id')) {
            Schema::table('postpartum_visits', function (Blueprint $table) {
                $table->dropForeign(['baby_id']);
                $table->dropColumn('baby_id');
            });
        }
    }
};
