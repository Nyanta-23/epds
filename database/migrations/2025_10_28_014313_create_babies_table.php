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
            // $table->enum('baby_condition', ['healthy', 'premature', 'low_bw', 'nicu'])->comment('To explain status baby condition');
            $table->unsignedTinyInteger('baby_condition')->comment('0: healthy, 1: premature, 2: low_bw, 3: nicu');
            // $table->enum('typeof_delivery', ['normal', 'caesar', 'forsep'])->comment('To explain type of delivery');
            $table->unsignedTinyInteger('typeof_delivery')->comment('0: normal, 1: c_section, 2: forsep');

            $table->enum('gender', ['male', 'female']);

            $table->softDeletes();


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
