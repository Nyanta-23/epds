<?php


if (!function_exists('category_score')) {
  function category_score($score)
  {
    if ($score <= 9) {
      return "Normal";
    } elseif ($score >= 10 && $score <= 12) {
      return "Low Risk";
    } else {
      return "High Risk";
    }
  }
}


if (!function_exists('interpreted_score')) {
  function interpreted_score($score)
  {
    if ($score <= 9) {
      return "No depression / Normal";
    } elseif ($score >= 10 && $score <= 12) {
      return "Further monitoring needed";
    } elseif ($score >= 13 && $score <= 19) {
      return "Consider referral to psychologist/psychiatrist";
    } else {
      return "Immediate referral to mental health professional";
    }
  }
}


if (!function_exists('category_baby_condition')) {
  function category_baby_condition($value)
  {
    if ($value == 0) {
      return [
        'value' => $value,
        'cateogry' => 'Sehat'
      ];
    } else if ($value == 1) {
      return [
        'value' => $value,
        'category' => "Prematur"
      ];
    } else if ($value == 2) {
      return [
        'value' => $value,
        'category' => "Berat badan rendah"
      ];
    } else if ($value == 3) {
      return [
        'value' => $value,
        'category' => 'Neonatal Intesive Care Unit'
      ];
    }
  }

  if (!function_exists('category_typeof_delivery')) {
    function category_typeof_delivery($value)
    {
      switch ($value) {
        case 0:
          return [
            'value' => $value,
            'category' => "normal"
          ];
        case 1:
          return [
            'value' => $value,
            'category' => 'operasi caesar'
          ];
        case 2:
          return [
            'value' => $value,
            'category' => 'forsep'
          ];
      }
    }
  }
}

if (! function_exists('generate_dummy_recommendation')) {
    function generate_dummy_recommendation(int $score): array
    {
        if ($score >= 0 && $score <= 9) {
            return [
                'recommendation' => "Kondisi emosional Mama hari ini dalam keadaan baik. Jangan khawatir apabila dalam beberapa hari ke depan Mama merasa mudah menangis, lelah, atau suasana hati mudah berubah. Hal ini merupakan kondisi yang wajar dialami oleh sebagian ibu setelah melahirkan dan dikenal sebagai postpartum blues.\n\nTIPS: Tetap jaga kesehatan dengan :\n• Istirahat cukup,\n• Konsumsi makanan bergizi\n• Berbagi perasaan dengan suami, keluarga terdekat atau bidan.\n• Lakukan aktivitas ringan seperti berjalan santai atau olahraga ringan agar tubuh tetap bugar.",
                'pesan' => "\"Jika kamu bersyukur, niscaya Aku akan menambah (nikmat) kepadamu.\" (QS. Ibrahim: 7)\n\nMama telah melalui perjalanan yang luar biasa. Mensyukuri langkah kecil hari ini dapat membuka ruang bagi kebaikan yang lebih besar di hari esok"
            ];
        } 
        
        if ($score >= 10 && $score <= 12) {
           return [
               'recommendation' => "Mama mungkin sedang mengalami perubahan suasana hati yang cukup terasa setelah melahirkan. Kondisi ini sering disebut postpartum blues dan cukup umum terjadi pada ibu setelah persalinan.\n\nTIPS:\n• Cobalah untuk beristirahat yang cukup dan konsumsi makanan bergizi\n• Meminta bantuan keluarga dalam merawat bayi\n• Berbagi perasaan dengan orang terdekat\n• Mama juga dapat melakukan aktivitas ringan seperti berjalan santai, peregangan, atau olahraga ringan untuk membantu tubuh menjadi lebih rileks dan melepaskan ketegangan emosi.\n\nApabila perasaan tidak membaik dalam dua minggu, atau terasa semakin berat, disarankan untuk berkonsultasi dengan bidan atau tenaga kesehatan.",
               'pesan' => "QS. Al-Insyirah (94): 5–6\n\n\"Sesungguhnya bersama kesulitan ada kemudahan. Sungguh, bersama kesulitan ada kemudahan.\"\n\nMama, jangan khawatir. Setiap menemukan kesulitan, Tuhan akan mengirimkan sepaket dengan kemudahan. Tarik nafas panjang, mari kita tetap syukuri kondisi Mama dan bayi saat ini. Mama tidak sendirian. Perasaan khawatir ini bukan tanda kelemahan, tetapi bukti bahwa hati Mama sangat peka dan penuh kasih. Istirahatkan pundak Mama sejenak. Tak apa meminta bantuan, tak apa bercerita, tak apa menangis sebentar, itu semua bagian dari cara Tuhan menguatkan hatimu."
           ];
        } 
        
        if ($score >= 13) {
            return [
                'recommendation' => "Hasil skrining menunjukkan bahwa Mama mungkin sedang mengalami tekanan emosional yang cukup berat setelah melahirkan. Sangat disarankan untuk berkonsultasi dengan bidan, dokter, atau tenaga kesehatan agar Mama dapat memperoleh dukungan dan bantuan yang tepat. Dukungan dari suami dan keluarga juga sangat penting untuk membantu Mama melewati masa ini",
                'pesan' => "\"Katakanlah: Wahai hamba-hamba-Ku yang melampaui batas terhadap diri mereka, janganlah berputus asa dari rahmat Allah.\" (QS. Az-Zumar: 53)\n\nMama adalah wanita yang kuat. Jika saat ini hati Mama terasa lelah, itu bukan kesalahan Mama. Perasaan yang naik turun bukanlah tanda kelemahan, melainkan tanda bahwa Mama telah berjuang begitu banyak."
            ];
        }

        return [
            'recommendation' => "Skor tidak valid. Silakan lakukan skrining ulang.",
            'pesan' => ""
        ];
    }
}
