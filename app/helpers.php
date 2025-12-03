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
    function generate_dummy_recommendation(int $score): string
    {
        if ($score >= 0 && $score <= 9) {


            return 'Surah Ibrahim 7
“Jika kamu bersyukur, niscaya Aku akan menambah (nikmat).”

Mama, apa yang sudah mama lalui sekarang adalah hal yang hebat, Syukur atas langkah kecil hari ini akan membuka ruang bagi kebaikan yang lebih besar esok hari, terima kasih sudah bertahan sejauh ini. ';
            
        } 
        
        if ($score >= 10 && $score <= 12) {
 
           return 'QS. Al-Insyirah (94): 5–6 

"Sesungguhnya bersama kesulitan ada kemudahan. Sungguh, bersama kesulitan ada kemudahan."

Mama, jangan khawatir. Setiap menemukan kesulitan, Tuhan akan mengirimkan sepaket dengan kemudahan. Tarik nafas panjang, mari kita tetap syukuri kondisi Mama dan bayi saat ini. Mama tidak sendirian. Perasaan khawatir ini bukan tanda kelemahan, tetapi bukti bahwa hati Mama sangat peka dan penuh kasih. Istirahatkan pundak Mama sejenak. Tak apa meminta bantuan, tak apa bercerita, tak apa menangis sebentar, itu semua bagian dari cara Tuhan menguatkan hatimu.';
        } 
        
        if ($score >= 13 && $score <= 19) {

            return "QS. Az-Zumar (39): 53 

“Katakanlah: Wahai hamba-hamba-Ku yang melampaui batas terhadap diri mereka, janganlah berputus asa dari rahmat Allah…”

Mama adalah wanita hebat,  meski hasilnya menunjukkan hati Mama sedang lelah, ini bukan salah Mama. Perasaan yang naik turun bukan tanda kurangnya iman, hanya pertanda Mama sudah terlalu lama berjuang. Pelan-pelan saja ya..,  ada jalan keluar, ada bantuan, dan Mama tidak sendiri.";
        } 
        
        if ($score >= 20) {

            return "QS. Az-Zumar (39): 53 

“Katakanlah: Wahai hamba-hamba-Ku yang melampaui batas terhadap diri mereka, janganlah berputus asa dari rahmat Allah…”

Mama adalah wanita hebat,  meski hasilnya menunjukkan hati Mama sedang lelah, ini bukan salah Mama. Perasaan yang naik turun bukan tanda kurangnya iman, hanya pertanda Mama sudah terlalu lama berjuang. Pelan-pelan saja ya..,  ada jalan keluar, ada bantuan, dan Mama tidak sendiri.";
        }

        return "Skor tidak valid. Silakan lakukan skrining ulang.";
    }
}
