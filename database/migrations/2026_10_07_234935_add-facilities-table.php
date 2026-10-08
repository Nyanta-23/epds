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
        Schema::create('facility_types', function(Blueprint $table) {
           $table->uuid('id')->primary();
           $table->string('name', 40);
           $table->boolean('is_deleted')->default(false);
           $table->timestamp('created_at');
           $table->timestamp('updated_at');
           $table->timestamp('deleted_at')->nullable();
        });

        Schema::create('facilities', function(Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('facility_type_id')->references('id')->on('facility_types')->nullable();
            $table->string('parent_id', 250)->nullable();
            $table->string('name', 200);
            $table->char('province_id', 2);
            $table->char('regency_id', 4);
            $table->char('district_id', 7);
            $table->char('village_id', 10);
            $table->boolean('is_deleted')->default(false);
            $table->timestamp('created_at');
            $table->timestamp('updated_at');
            $table->timestamp('deleted_at')->nullable();

            $table->foreign('province_id')->references('id')->on('provinces')->onDelete('cascade')->onUpdated('cascade');
            $table->foreign('regency_id')->references('id')->on('regencies')->onDelete('cascade')->onUpdated('cascade');
            $table->foreign('district_id')->references('id')->on('districts')->onDelete('cascade')->onUpdated('cascade');
            $table->foreign('village_id')->references('id')->on('villages')->onDelete('cascade')->onUpdated('cascade');

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::drop('facility_types');
        Schema::drop('facilities');
    }
};
