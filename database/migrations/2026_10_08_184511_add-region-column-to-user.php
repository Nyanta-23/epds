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
        Schema::table('users', function (Blueprint $table) {
            $table->char('province_migrate_id', 2)->nullable()->after('province');
            $table->char('regency_migrate_id', 4)->nullable()->after('city_or_district');
            $table->char('district_migrate_id', 7)->nullable()->after('subdistrict');
            $table->char('village_migrate_id', 10)->nullable()->after('village');

            $table->foreign('province_migrate_id')->references('id')->on('provinces')->onDelete('cascade')->onUpdated('cascade');
            $table->foreign('regency_migrate_id')->references('id')->on('regencies')->onDelete('cascade')->onUpdated('cascade');
            $table->foreign('district_migrate_id')->references('id')->on('districts')->onDelete('cascade')->onUpdated('cascade');
            $table->foreign('village_migrate_id')->references('id')->on('villages')->onDelete('cascade')->onUpdated('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
    }
};
