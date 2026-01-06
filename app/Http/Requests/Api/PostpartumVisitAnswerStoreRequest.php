<?php

namespace App\Http\Requests\Api;

use Illuminate\Foundation\Http\FormRequest;

class PostpartumVisitAnswerStoreRequest extends FormRequest
{
  /**
   * Determine if the user is authorized to make this request.
   */
  public function authorize(): bool
  {
    return true;
  }

  /**
   * Get the validation rules that apply to the request.
   *
   * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
   */
  public function rules(): array
  {
    return [
      // visit_number dihitung otomatis dari schedule service, tidak perlu dari request
      'date_filled' => ['required', 'date'],

      'parity_count' => ['required', 'string', 'in:1,2-4,>5'],
      'sleep_quality' => ['required', 'integer'],
      'partner_support' => ['required', 'integer'],
      'live_with_partner' => ['required', 'boolean'],

      'family_salary_permonth' => ['required', 'integer'],
      'dependent_family_count' => ['required', 'integer'],
      'is_salary_sufficient' => ['required', 'integer'],

      'psych_history' => ['required', 'boolean'],
      'psych_treatment' => ['required', 'boolean'],
      'psych_trauma' => ['required', 'boolean'],
      'preg_comp_history' => ['required', 'boolean'],
      'last_comp' => ['required', 'boolean'],
      'last_comp_note' => ['nullable', 'string'],
      'baby_caregiver' => ['required', 'array'],
      'answers' => ['required', 'array'],
      'answers.*.answer' => ['required', 'string'],
      'answers.*.question_id' => ['required', 'uuid']

    ];
  }


  public function messages(): array
  {
    return [

      // --- VISIT DATA ---
      'visit_number.required' => 'Nomor kunjungan wajib diisi.',
      'visit_number.integer' => 'Nomor kunjungan harus berupa angka.',
      'visit_number.min' => 'Nomor kunjungan minimal bernilai 1.',

      'date_filled.required' => 'Tanggal pengisian wajib diisi.',
      'date_filled.date' => 'Tanggal pengisian tidak valid.',

      'sleep_quality.required' => 'Kualitas tidur wajib dipilih.',
      'partner_support.required' => 'Dukungan pasangan wajib dipilih.',
      'live_with_partner.required' => 'Status tinggal dengan pasangan wajib dipilih.',
      'live_with_partner.boolean' => 'Nilai tinggal dengan pasangan tidak valid.',

      'family_economy.required' => 'Kondisi ekonomi keluarga wajib dipilih.',

      'psych_history.required' => 'Riwayat psikologis wajib dipilih.',
      'psych_history.boolean' => 'Format riwayat psikologis tidak valid.',

      'psych_treatment.required' => 'Riwayat perawatan psikologis wajib dipilih.',
      'psych_treatment.boolean' => 'Format riwayat perawatan psikologis tidak valid.',

      'psych_trauma.required' => 'Riwayat trauma psikologis wajib dipilih.',
      'psych_trauma.boolean' => 'Format riwayat trauma tidak valid.',

      'parity_count.required' => 'Jumlah paritas wajib diisi.',
      'preg_comp_history.required' => 'Riwayat komplikasi kehamilan wajib diisi.',
      'preg_comp_history.boolean' => 'Format komplikasi kehamilan tidak valid.',

      'last_comp.required' => 'Riwayat komplikasi terakhir wajib dipilih.',
      'last_comp.boolean' => 'Format komplikasi terakhir tidak valid.',
      'last_comp_note.string' => 'Catatan komplikasi harus berupa teks.',

      'baby_healthy.required' => 'Status kesehatan bayi wajib dipilih.',
      'baby_healthy.boolean' => 'Format kesehatan bayi tidak valid.',

      'baby_caregiver.required' => 'Pengasuh bayi wajib dipilih.',

      'feed_type.required' => 'Jenis pemberian makan wajib dipilih.',


      // --- ANSWERS ---
      'answers.required' => 'Jawaban kuesioner wajib diisi.',
      'answers.array' => 'Format jawaban kuesioner tidak valid.',

      'answers.*.answer.required' => 'Setiap jawaban wajib diisi.',
      'answers.*.question_id.required' => 'Setiap pertanyaan wajib memiliki ID.',
      'answers.*.question_id.uuid' => 'Format ID pertanyaan tidak valid.',

      'answers.*.postpartum_visit_id.required' => 'Setiap jawaban harus memiliki ID kunjungan postpartum.',
      'answers.*.postpartum_visit_id.uuid' => 'Format ID kunjungan postpartum tidak valid.',
    ];
  }
}
