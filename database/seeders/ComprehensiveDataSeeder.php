<?php

namespace Database\Seeders;

use App\Models\Answer;
use App\Models\AutoRecomendation;
use App\Models\Baby;
use App\Models\Followup;
use App\Models\OptionQuestion;
use App\Models\Permission;
use App\Models\PostpartumVisit;
use App\Models\Question;
use App\Models\RecomendationRule;
use App\Models\RecomendationVariation;
use App\Models\Result;
use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Seeder;

class ComprehensiveDataSeeder extends Seeder
{
  /**
   * Run the database seeds.
   */
  public function run(): void
  {
    // 1. Seed Roles
    $this->seedRoles();

    // 2. Seed Permissions
    $this->seedPermissions();

    // 3. Seed Users (Super Admin, Admin, Midwife, Patient)
    $this->seedUsers();

    // 4. Seed Babies
    $this->seedBabies();

    // 5. Seed Questions and Options
    $this->seedQuestionsAndOptions();

    // 6. Seed Postpartum Visits
    $this->seedPostpartumVisits();

    // 7. Seed Answers
    $this->seedAnswers();

    // 8. Seed Results
    $this->seedResults();

    // 9. Seed Followups
    $this->seedFollowups();

    // 10. Seed Recomendation Rules and Variations
    $this->seedRecomendations();

    echo "\n✅ All data seeded successfully!\n";
  }

  private function seedRoles(): void
  {
    $roles = [
      ['name' => 'Super Admin', 'slug' => 'super_admin'],
      ['name' => 'Admin', 'slug' => 'admin'],
      ['name' => 'Midwife', 'slug' => 'midwife'],
      ['name' => 'Patient', 'slug' => 'patient'],
    ];

    foreach ($roles as $role) {
      Role::create($role);
    }

    echo "✅ Roles seeded (4 roles)\n";
  }

  private function seedPermissions(): void
  {
    $permissions = [
      'view_users',
      'create_user',
      'edit_user',
      'delete_user',
      'view_patients',
      'create_patient',
      'edit_patient',
      'delete_patient',
      'view_reports',
      'create_report',
      'export_report',
      'view_dashboard',
      'manage_settings',
      'manage_roles',
      'view_notifications',
      'manage_notifications',
    ];

    foreach ($permissions as $permission) {
      Permission::create([
        'name' => $permission,
        'slug' => str_replace('_', '-', $permission),
      ]);
    }

    echo "✅ Permissions seeded (" . count($permissions) . " permissions)\n";
  }

  private function seedUsers(): void
  {
    $superAdminRole = Role::where('slug', 'super_admin')->first();
    $adminRole = Role::where('slug', 'admin')->first();
    $midwifeRole = Role::where('slug', 'midwife')->first();
    $patientRole = Role::where('slug', 'patient')->first();

    // Super Admin
    User::create([
      'name' => 'Super Admin',
      'email' => 'superadmin@epds.local',
      'email_unique' => 'superadmin@epds.local',
      'password' => bcrypt('password'),
      'role_id' => $superAdminRole->id,
      'email_verified_at' => now(),
      'is_verified' => true,
      'phone_number' => '08111111111',
      'birthplace' => 'Jakarta',
      'date_of_birth' => '1980-01-15',
      'job' => 'Administrator',
      'province' => 'DKI Jakarta',
      'city_or_district' => 'Jakarta Pusat',
      'address' => 'Jl. Admin No. 1',
    ]);

    // Admins (3)
    for ($i = 1; $i <= 3; $i++) {
      User::create([
        'name' => "Admin Puskesmas $i",
        'email' => "admin$i@epds.local",
        'email_unique' => "admin$i@epds.local",
        'password' => bcrypt('password'),
        'role_id' => $adminRole->id,
        'email_verified_at' => now(),
        'is_verified' => true,
        'phone_number' => "081111111" . $i,
        'birthplace' => 'Jakarta',
        'date_of_birth' => '1985-01-15',
        'job' => 'Puskesmas Admin',
        'province' => 'DKI Jakarta',
        'city_or_district' => 'Jakarta Pusat',
        'address' => "Jl. Admin No. $i",
      ]);
    }

    // Midwives (5)
    for ($i = 1; $i <= 5; $i++) {
      User::create([
        'name' => "Bidan Siti $i",
        'email' => "bidan$i@epds.local",
        'email_unique' => "bidan$i@epds.local",
        'password' => bcrypt('password'),
        'role_id' => $midwifeRole->id,
        'email_verified_at' => now(),
        'is_verified' => true,
        'phone_number' => "082222222" . str_pad($i, 2, '0', STR_PAD_LEFT),
        'birthplace' => 'Bandung',
        'date_of_birth' => '1990-05-20',
        'job' => 'Bidan',
        'province' => 'Jawa Barat',
        'city_or_district' => 'Bandung',
        'highest_education' => 'D3',
        'address' => "Jl. Bidan No. $i",
      ]);
    }

    // Patients (10)
    for ($i = 1; $i <= 10; $i++) {
      User::create([
        'name' => "Ibu Hamil $i",
        'email' => "patient$i@epds.local",
        'email_unique' => "patient$i@epds.local",
        'password' => bcrypt('password'),
        'role_id' => $patientRole->id,
        'email_verified_at' => now(),
        'is_verified' => true,
        'phone_number' => "083333333" . str_pad($i, 2, '0', STR_PAD_LEFT),
        'birthplace' => 'Sukabumi',
        'date_of_birth' => '1995-03-10',
        'job' => 'Ibu Rumah Tangga',
        'married_status' => 'married',
        'highest_education' => 'SMA',
        'province' => 'Jawa Barat',
        'city_or_district' => 'Sukabumi',
        'address' => "Jl. Pasien No. $i",
      ]);
    }

    echo "✅ Users seeded (1 super admin, 3 admins, 5 midwives, 10 patients)\n";
  }

  private function seedBabies(): void
  {
    $patients = User::where('role_id', Role::where('slug', 'patient')->first()->id)->get();

    $deliveryTypes = [0, 1, 2]; // NORMAL, C_SECTION, FORSEP
    $babyConditions = [0, 1, 2, 3]; // HEALTHY, PREMATURE, LOW_BW, NICU
    $feedTypes = [0, 1, 2]; // EXCLUSIVE, MIXED, FORMULA

    foreach ($patients as $patient) {
      // 1-2 babies per patient
      for ($i = 1; $i <= rand(1, 2); $i++) {
        Baby::create([
          'mother_id' => $patient->id,
          'which_child' => $i,
          'gender' => $i % 2 == 0 ? 'male' : 'female',
          'typeof_delivery' => $deliveryTypes[array_rand($deliveryTypes)],
          'baby_condition' => $babyConditions[array_rand($babyConditions)],
          'feed_type' => $feedTypes[array_rand($feedTypes)],
          'date_of_birth' => now()->subDays(rand(5, 90)),
        ]);
      }
    }

    echo "✅ Babies seeded (" . Baby::count() . " babies)\n";
  }

  private function seedQuestionsAndOptions(): void
  {
    $questions = [
      'Apakah Anda merasa sedih atau putus asa?',
      'Apakah Anda mengalami kesulitan tidur?',
      'Apakah Anda mudah merasa lelah atau kelelahan?',
      'Apakah Anda mengalami perubahan nafsu makan?',
      'Apakah Anda sulit berkonsentrasi?',
      'Apakah Anda merasa bersalah atau tidak berharga?',
      'Apakah Anda memiliki pikiran untuk menyakiti diri sendiri?',
      'Apakah Anda merasa khawatir atau cemas?',
      'Apakah hubungan Anda dengan bayi berjalan baik?',
      'Apakah Anda mendapatkan dukungan dari keluarga?',
    ];

    foreach ($questions as $index => $questionText) {
      $question = Question::create([
        'number_question' => $index + 1,
        'question' => $questionText,
      ]);

      // Create options for each question
      $options = [
        ['option_text' => 'Tidak', 'value' => 0, 'option' => 'A'],
        ['option_text' => 'Kadang-kadang', 'value' => 1, 'option' => 'B'],
        ['option_text' => 'Sering', 'value' => 2, 'option' => 'C'],
        ['option_text' => 'Selalu', 'value' => 3, 'option' => 'D'],
      ];

      foreach ($options as $option) {
        OptionQuestion::create([
          'question_id' => $question->id,
          'option' => $option['option'],
          'option_text' => $option['option_text'],
          'value' => $option['value'],
        ]);
      }
    }

    echo "✅ Questions seeded (" . Question::count() . " questions with options)\n";
  }

  private function seedPostpartumVisits(): void
  {
    $babies = Baby::all();
    $parityOptions = ['1x', '2x', '3x'];

    foreach ($babies as $baby) {
      // 1-3 postpartum visits per baby
      for ($i = 1; $i <= rand(1, 3); $i++) {
        // Use raw insert to avoid enum casting issues
        \Illuminate\Support\Facades\DB::table('postpartum_visits')->insert([
          'id' => \Illuminate\Support\Str::uuid(),
          'baby_id' => $baby->id,
          'mother_id' => $baby->mother_id,
          'visit_number' => $i,
          'date_filled' => $baby->date_of_birth->addDays(rand(1, 42)),
          'sleep_quality' => rand(0, 2),
          'partner_support' => rand(0, 2),
          'live_with_partner' => rand(0, 1),
          'family_salary_permonth' => rand(0, 3),
          'dependent_family_count' => rand(0, 2),
          'is_salary_sufficient' => rand(0, 2),
          'psych_history' => rand(0, 1),
          'psych_treatment' => rand(0, 1),
          'psych_trauma' => rand(0, 1),
          'last_comp' => rand(0, 1),
          'last_comp_note' => rand(0, 1) ? 'Ada komplikasi pada kehamilan sebelumnya' : null,
          'preg_comp_history' => rand(0, 1),
          'parity_count' => $parityOptions[array_rand($parityOptions)],
          'baby_healthy' => rand(0, 1),
          'baby_caregiver' => rand(0, 3),
          'feed_type' => $baby->feed_type,
          'created_at' => now(),
          'updated_at' => now(),
        ]);
      }
    }

    echo "✅ Postpartum Visits seeded (" . PostpartumVisit::count() . " visits)\n";
  }

  private function seedAnswers(): void
  {
    $visits = PostpartumVisit::all();
    $questions = Question::all();

    foreach ($visits as $visit) {
      // Answer each question for this visit
      foreach ($questions as $question) {
        $options = $question->options;
        $randomOption = $options->random();

        Answer::create([
          'postpartum_visit_id' => $visit->id,
          'question_id' => $question->id,
          'option_id' => $randomOption->id,
          'value' => $randomOption->value,
        ]);
      }
    }

    echo "✅ Answers seeded (" . Answer::count() . " answers)\n";
  }

  private function seedResults(): void
  {
    $visits = PostpartumVisit::all();

    foreach ($visits as $visit) {
      $totalScore = Answer::where('postpartum_visit_id', $visit->id)->sum('value');

      if ($totalScore <= 9) {
        $status = 'low_risk';
        $recommendation = 'Tidak ada risiko depresi, lanjutkan monitoring rutin';
      } elseif ($totalScore <= 19) {
        $status = 'moderate_risk';
        $recommendation = 'Ada risiko depresi ringan, lakukan konseling';
      } else {
        $status = 'high_risk';
        $recommendation = 'Ada risiko depresi berat, rujuk ke spesialis';
      }

      Result::create([
        'postpartum_visit_id' => $visit->id,
        'total_score' => $totalScore,
        'status' => $status,
        'recommendation' => $recommendation,
      ]);
    }

    echo "✅ Results seeded (" . Result::count() . " results)\n";
  }

  private function seedFollowups(): void
  {
    $results = Result::where('status', '!=', 'low_risk')->get();
    $midwives = User::whereHas('role', fn($q) => $q->where('slug', 'midwife'))->get();

    $followupTypes = [0, 1, 2]; // EDUCATION, REFERENCE, MONITORING

    foreach ($results as $result) {
      // 1-2 followups per high/moderate risk result
      for ($i = 1; $i <= rand(1, 2); $i++) {
        Followup::create([
          'postpartum_visit_id' => $result->postpartumVisit->id,
          'user_id' => $midwives->random()->id,
          'type' => $followupTypes[array_rand($followupTypes)],
          'status' => ['pending', 'done', 'missed'][array_rand(['pending', 'done', 'missed'])],
          'follow_up_date' => $result->postpartumVisit->visit_date->addDays(rand(3, 14) * $i),
          'notes' => "Follow-up ke-$i untuk hasil: {$result->status}",
        ]);
      }
    }

    echo "✅ Followups seeded (" . Followup::count() . " followups)\n";
  }

  private function seedRecomendations(): void
  {
    // Create recomendation rules
    $rules = [
      [
        'name' => 'Depresi Ringan',
        'min_score' => 10,
        'max_score' => 14,
      ],
      [
        'name' => 'Depresi Sedang',
        'min_score' => 15,
        'max_score' => 19,
      ],
      [
        'name' => 'Depresi Berat',
        'min_score' => 20,
        'max_score' => 30,
      ],
    ];

    foreach ($rules as $ruleData) {
      $rule = RecomendationRule::create($ruleData);

      // Create variations for each rule
      $variations = [
        [
          'recomendation' => 'Konseling dengan psikolog',
          'priority' => 'high',
        ],
        [
          'recomendation' => 'Dukungan keluarga dan komunitas',
          'priority' => 'medium',
        ],
        [
          'recomendation' => 'Terapi farmakologi jika diperlukan',
          'priority' => 'medium',
        ],
      ];

      foreach ($variations as $variation) {
        RecomendationVariation::create([
          'recomendation_rule_id' => $rule->id,
          'recomendation' => $variation['recomendation'],
          'priority' => $variation['priority'],
        ]);
      }
    }

    // Create auto recomendations
    AutoRecomendation::create([
      'name' => 'Notifikasi Risiko Tinggi',
      'condition' => 'score >= 20',
      'action' => 'Kirim notifikasi ke midwife dan admin',
    ]);

    echo "✅ Recomendations seeded (" . RecomendationRule::count() . " rules with variations)\n";
  }
}
