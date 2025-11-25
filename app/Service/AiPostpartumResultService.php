<?php

namespace App\Service;

use Gemini;
use Gemini\Client;

class AiPostpartumResultService
{

  public function analyze(array $data)
  {

    // $client = new Client(env("GEMINI_API_KEY"));

    $geminiApiKey = env('GEMINI_API_KEY');


    $client = Gemini::client($geminiApiKey);

    $prompt = $this->buildPrompt($data);

    $result = $client
      ->generativeModel(model: 'gemini-1.5-flash')
      ->generateContent($prompt);

    dd($result);
  }

  private function buildPrompt(array $data)
  {
    $qaText = "";
    foreach ($data['answers'] as $item) {
      $qaText .= "- {$item['question']} : {$item['answer']}\n";
    }

    return "
Analisis data skrining postpartum berikut dan berikan rekomendasi singkat untuk ibu.

Pertanyaan & Jawaban EPDS:
$qaText
Skor EPDS: {$data['total_score']}
Hasil EPDS: {$data['result_epds']}

Data Postpartum:
- Kualitas tidur: {$data['sleep_quality']}
- Dukungan pasangan: {$data['partner_support']}
- Ekonomi keluarga: {$data['family_economy']}
- Riwayat psikologis: {$data['psych_history']}
- Kondisi bayi: {$data['baby_healthy']}
- Jenis menyusui: {$data['feed_type']}

Instruksi:
- Berikan NASIHAT SINGKAT hanya 2–4 kalimat.
- Gunakan bahasa Indonesia yang lembut, hangat, dan suportif.
- Nada seperti bidan atau tenaga kesehatan yang menenangkan ibu.
- Hindari istilah medis berat.
- Jangan menakut-nakuti.
- Tidak perlu JSON, hanya teks biasa.
";
  }
}
