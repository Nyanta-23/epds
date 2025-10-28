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
        Schema::table('users', function (Blueprint $table) {
            $table->string('phone_number', 50)->nullable();
            $table->string('birthplace', 50)->nullable();
            $table->date('date_of_birth')->nullable();
            $table->string('job', 255)->nullable();
            $table->enum('married_status', ['married', 'not_married', 'divorced'])->nullable();
            $table->string('highest_education', 10)->nullable(); // enum SD / SMP / SMA / D3 / S1 / ETC
            $table->string('province', 50)->nullable();
            $table->string('city_or_district', 50)->nullable();
            $table->string('subdistrict', 50)->nullable();
            $table->string('village', 50)->nullable();
            $table->text('address')->nullable();
            $table->boolean('verified')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'phone_number',
                'birthplace',
                'date_of_birth',
                'job',
                'married_status',
                'highest_education',
                'province',
                'city_or_district',
                'subdistrict',
                'village',
                'address',
                'verified'
            ]);
        });
    }
};
