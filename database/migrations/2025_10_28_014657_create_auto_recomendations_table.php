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
        Schema::create('auto_recomendations', function (Blueprint $table) {
            $table->foreignUuid('recomendation_variation_id')
                ->references('id')
                ->on('recomendation_variations')
                ->onUpdate('restrict')
                ->onDelete('restrict');

            $table->foreignUuid('result_id')
                ->references('id')
                ->on('results')
                ->onUpdate('restrict')
                ->onDelete('restrict');


            $table->primary(['recomendation_variation_id', 'result_id']);

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('auto_recomendations');
    }
};
