<?php

namespace Database\Seeders;

use App\Models\Question;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class QuestionAndOptionQuestionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
   {

        $questions = [
            [
                'number' => 1,
                'question' => 'Saya mampu tertawa dan merasakan hal-hal yang menyenangkan',
                'options' => [
                    ['option' => 'a', 'option_text' => 'Sebanyak yang saya bisa', 'value' => 0],
                    ['option' => 'b', 'option_text' => 'Tidak terlalu banyak', 'value' => 1],
                    ['option' => 'c', 'option_text' => 'Tidak banyak', 'value' => 2],
                    ['option' => 'd', 'option_text' => 'Tidak sama sekali', 'value' => 3],
                ],
            ],
            [
                'number' => 2,
                'question' => 'Saya melihat segala sesuatunya kedepan sangat menyenangkan',
                'options' => [
                    ['option' => 'a', 'option_text' => 'Sebanyak sebelumnya', 'value' => 0],
                    ['option' => 'b', 'option_text' => 'Agak sedikit kurang dibandingkan dengan sebelumnya', 'value' => 1],
                    ['option' => 'c', 'option_text' => 'Kurang dibandingkan dengan sebelumnya', 'value' => 2],
                    ['option' => 'd', 'option_text' => 'Tidak pernah sama sekali', 'value' => 3],
                ],
            ],
            [
                'number' => 3,
                'question' => 'Saya menyalahkan diri saya sendiri saat sesuatu terjadi tidak sebagaimana mestinya',
                'options' => [
                    ['option' => 'a', 'option_text' => 'Ya, setiap saat', 'value' => 3],
                    ['option' => 'b', 'option_text' => 'Ya, kadang-kadang', 'value' => 2],
                    ['option' => 'c', 'option_text' => 'Tidak terlalu sering', 'value' => 1],
                    ['option' => 'd', 'option_text' => 'Tidak pernah sama sekali', 'value' => 0],
                ],
            ],
            [
                'number' => 4,
                'question' => 'Saya merasa cemas atau merasa kuatir tanpa alasan yang jelas',
                'options' => [
                    ['option' => 'a', 'option_text' => 'Tidak pernah sama sekali', 'value' => 0],
                    ['option' => 'b', 'option_text' => 'Jarang-jarang', 'value' => 1],
                    ['option' => 'c', 'option_text' => 'Ya, kadang-kadang', 'value' => 2],
                    ['option' => 'd', 'option_text' => 'Ya, sering sekali', 'value' => 3],
                ],
            ],
            [
                'number' => 5,
                'question' => 'Saya merasa takut atau panik tanpa alasan yang jelas',
                'options' => [
                    ['option' => 'a', 'option_text' => 'Ya, cukup sering', 'value' => 3],
                    ['option' => 'b', 'option_text' => 'Ya, kadang-kadang', 'value' => 2],
                    ['option' => 'c', 'option_text' => 'Tidak terlalu sering', 'value' => 1],
                    ['option' => 'd', 'option_text' => 'Tidak pernah sama sekali', 'value' => 0],
                ],
            ],
            [
                'number' => 6,
                'question' => 'Segala sesuatunya terasa sulit untuk dikerjakan',
                'options' => [
                    ['option' => 'a', 'option_text' => 'Ya, hampir setiap saat saya tidak mampu menanganinya', 'value' => 3],
                    ['option' => 'b', 'option_text' => 'Ya, kadang-kadang saya tidak mampu menangani seperti biasanya', 'value' => 2],
                    ['option' => 'c', 'option_text' => 'Tidak terlalu, sebagian besar berhasil saya tangani', 'value' => 1],
                    ['option' => 'd', 'option_text' => 'Tidak pernah, saya mampu mengerjakan segala sesuatu dengan baik', 'value' => 0],
                ],
            ],
            [
                'number' => 7,
                'question' => 'Saya merasa tidak bahagia sehingga mengalami kesulitan untuk tidur',
                'options' => [
                    ['option' => 'a', 'option_text' => 'Ya, setiap saat', 'value' => 3],
                    ['option' => 'b', 'option_text' => 'Ya, kadang-kadang', 'value' => 2],
                    ['option' => 'c', 'option_text' => 'Tidak terlalu sering', 'value' => 1],
                    ['option' => 'd', 'option_text' => 'Tidak pernah sama sekali', 'value' => 0],
                ],
            ],
            [
                'number' => 8,
                'question' => 'Saya merasa sedih dan merasa diri saya menyedihkan',
                'options' => [
                    ['option' => 'a', 'option_text' => 'Ya, setiap saat', 'value' => 3],
                    ['option' => 'b', 'option_text' => 'Ya, cukup sering', 'value' => 2],
                    ['option' => 'c', 'option_text' => 'Tidak terlalu sering', 'value' => 1],
                    ['option' => 'd', 'option_text' => 'Tidak pernah sama sekali', 'value' => 0],
                ],
            ],
            [
                'number' => 9,
                'question' => 'Saya merasa tidak bahagia sehingga menyebabkan saya menangis',
                'options' => [
                    ['option' => 'a', 'option_text' => 'Ya, setiap saat', 'value' => 3],
                    ['option' => 'b', 'option_text' => 'Ya, cukup sering', 'value' => 2],
                    ['option' => 'c', 'option_text' => 'Di saat tertentu saja', 'value' => 1],
                    ['option' => 'd', 'option_text' => 'Tidak pernah sama sekali', 'value' => 0],
                ],
            ],
            [
                'number' => 10,
                'question' => 'Muncul pikiran untuk menyakiti diri saya sendiri',
                'options' => [
                    ['option' => 'a', 'option_text' => 'Ya, cukup sering', 'value' => 3],
                    ['option' => 'b', 'option_text' => 'Kadang-kadang', 'value' => 2],
                    ['option' => 'c', 'option_text' => 'Jarang sekali', 'value' => 1],
                    ['option' => 'd', 'option_text' => 'Tidak pernah sama sekali', 'value' => 0],
                ],
            ],
        ];


        foreach ($questions as $data) {
            $question = Question::create([
                'number' => $data['number'],
                'question' => $data['question']
            ]);

            foreach ($data['options'] as $option) {
                $question->optionQuestions()->create($option);
            }
        }
    }
}
