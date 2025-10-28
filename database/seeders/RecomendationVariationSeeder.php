<?php

namespace Database\Seeders;

use App\Models\RecomendationRule;
use App\Models\RecomendationVariation;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class RecomendationVariationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        RecomendationVariation::create([
            'recomendation_rule_id' => RecomendationRule::where('min_score', 0)->where('max_score', 9)->get()->first()->id,
            'recomendation_text' => 'Ibu dalam kondisi emosional baik. Lanjutkan dukungan keluarga dan pastikan waktu istirahat cukup.',
            'generated_at' => fake()->dateTime(),
        ]);
        RecomendationVariation::create([
            'recomendation_rule_id' => RecomendationRule::where('min_score', 0)->where('max_score', 9)->get()->first()->id,
            'recomendation_text' => 'Tidak diperlukan intervensi khusus. Tetap pantau kondisi emosi dan aktivitas sehari-hari secara rutin.',
            'generated_at' => fake()->dateTime()
        ]);
        RecomendationVariation::create([
            'recomendation_rule_id' => RecomendationRule::where('min_score', 0)->where('max_score', 9)->get()->first()->id,
            'recomendation_text' => 'Berikan edukasi umum mengenai kesehatan mental pasca persalinan untuk menjaga kesejahteraan ibu.',
            'generated_at' => fake()->dateTime()
        ]);


        RecomendationVariation::create([
            'recomendation_rule_id' => RecomendationRule::where('min_score', 10)->where('max_score', 12)->get()->first()->id,
            'recomendation_text' => 'Lakukan pemantauan ulang dalam 1 minggu. Berikan edukasi tentang pentingnya komunikasi dan istirahat cukup.',
            'generated_at' => fake()->dateTime()
        ]);
        RecomendationVariation::create([
            'recomendation_rule_id' => RecomendationRule::where('min_score', 10)->where('max_score', 12)->get()->first()->id,
            'recomendation_text' => 'Dorong ibu untuk bercerita kepada pasangan atau keluarga tentang perasaannya. Lanjutkan pemantauan rutin.',
            'generated_at' => fake()->dateTime()
        ]);
        RecomendationVariation::create([
            'recomendation_rule_id' => RecomendationRule::where('min_score', 10)->where('max_score', 12)->get()->first()->id,
            'recomendation_text' => 'Anjurkan kegiatan relaksasi ringan seperti jalan santai atau berbagi cerita dengan ibu lain yang mengalami hal serupa.',
            'generated_at' => fake()->dateTime()
        ]);

        RecomendationVariation::create([
            'recomendation_rule_id' => RecomendationRule::where('min_score', 13)->where('max_score', 19)->get()->first()->id,
            'recomendation_text' => 'Disarankan untuk konsultasi dengan psikolog klinis guna penilaian lebih lanjut. Midwife dapat memberikan dukungan emosional sementara.',
            'generated_at' => fake()->dateTime()
        ]);
        RecomendationVariation::create([
            'recomendation_rule_id' => RecomendationRule::where('min_score', 13)->where('max_score', 19)->get()->first()->id,
            'recomendation_text' => 'Lakukan pendampingan dan observasi perilaku ibu. Jika keluhan berlanjut, rujuk ke psikolog.',
            'generated_at' => fake()->dateTime()
        ]);
        RecomendationVariation::create([
            'recomendation_rule_id' => RecomendationRule::where('min_score', 13)->where('max_score', 19)->get()->first()->id,
            'recomendation_text' => 'Rekomendasikan sesi konseling awal dengan tenaga profesional dan pastikan ibu memiliki dukungan keluarga yang cukup.',
            'generated_at' => fake()->dateTime()
        ]);

        RecomendationVariation::create([
            'recomendation_rule_id' => RecomendationRule::where('min_score', 13)->where('max_score', 19)->get()->first()->id,
            'recomendation_text' => 'Segera rujuk ke psikiater atau layanan kesehatan jiwa. Pastikan ibu tidak dibiarkan sendirian dan selalu didampingi keluarga.',
            'generated_at' => fake()->dateTime()
        ]);
        RecomendationVariation::create([
            'recomendation_rule_id' => RecomendationRule::where('min_score', 13)->where('max_score', 19)->get()->first()->id,
            'recomendation_text' => 'Lakukan intervensi segera. Koordinasikan dengan tim kesehatan mental untuk pemeriksaan lanjutan.',
            'generated_at' => fake()->dateTime()
        ]);
        RecomendationVariation::create([
            'recomendation_rule_id' => RecomendationRule::where('min_score', 13)->where('max_score', 19)->get()->first()->id,
            'recomendation_text' => 'Perlu tindakan cepat: lakukan rujukan formal dan pantau kondisi ibu selama proses perawatan berlangsung.',
            'generated_at' => fake()->dateTime()
        ]);
    }
}
