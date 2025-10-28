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
        Schema::table('recomendation_variations', function (Blueprint $table) {
            $table->foreignUuid('recomendation_rule_id')
                ->references('id')
                ->on('recomendation_rules')
                ->onUpdate('cascade')
                ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('recomendation_variations', function (Blueprint $table) {
            $table->dropForeign(['recomendation_rule_id']);
            $table->dropColumn('recomendation_rule_id');
        });
    }
};
