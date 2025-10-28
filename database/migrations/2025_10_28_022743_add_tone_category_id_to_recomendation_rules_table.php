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
        Schema::table('recomendation_rules', function (Blueprint $table) {
            $table->foreignUuid('tone_category_id')
                ->references('id')
                ->on('tone_categories')
                ->onUpdate('cascade')
                ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('recomendation_rules', function (Blueprint $table) {
            $table->dropForeign(['tone_category_id']);
            $table->dropColumn('tone_category_id');
        });
    }
};
