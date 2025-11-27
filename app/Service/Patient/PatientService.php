<?php

namespace App\Service\Patient;

use App\DTO\Request\Patient\PatientUpdateAttributeRequest;
use App\Models\PostpartumVisit;
use App\Models\User;
use Exception;
use Illuminate\Support\Facades\DB;
use Log;

class PatientService
{

  public function index($filters)
  {

    $search = $filters['search'];
    $verified = filter_var($filters['filter_list']['select_filter']['is_verified'], FILTER_VALIDATE_BOOLEAN);
    $canVisit = filter_var($filters['filter_list']['select_filter']['is_can_visit'], FILTER_VALIDATE_BOOLEAN);

    $query = User::with('role')
      ->whereHas('role', function ($query) {
        $query->where('slug', 'patient');
      })
      ->when($search, function ($query, $search) {
        $query->where(function ($q) use ($search) {
          $searchTerms = '%' . $search . '%';
          $q->where('name', 'like', $searchTerms);
        });
      })
      ->when($verified, fn($q) => $q->where('is_verified', $verified))
      ->when($canVisit, fn($q) => $q->where('is_can_visit', $canVisit))
      ->latest();

    return $query->paginate(10)
      ->withQueryString();
  }

  public function getPatients(?string $id = null)
  {
    try {
      $results = User::with('role')->with('babies')
        ->whereHas('role', function ($query) {
          $query->where('slug', 'patient');
        })->latest();

      if ($id) {
        $results->where('id', '=', $id);
      }
      $results = $results->get();

      if ($id && sizeof($results) == 0)
        throw new Exception('user not found', 404);

      return $results;
    } catch (Exception $error) {
      throw new Exception($error->getMessage(), $error->getCode());
    }
  }


  public function update(PatientUpdateAttributeRequest $request, string $id)
  {
    try {
      $user = User::find($id);

      if (!$user)
        throw new Exception("pengguna tidak ditemukan", 404);

      $user->fill([
        'name' => $request->name,
        'phone_number' => $request->phone_number,
        'birthplace' => $request->birthplace,
        'date_of_birth' => $request->date_of_birth,
        'job' => $request->job,
        'married_status' => $request->married_status,
        'highest_education' => $request->highest_education,
        'province' => $request->province,
        'city_or_district' => $request->city_or_district,
        'subdistrict' => $request->subdistrict,
        'village' => $request->village,

        'province_id' => $request->province_id,
        'city_or_district_id' => $request->city_or_district_id,
        'subdistrict_id' => $request->subdistrict_id,
        'village_id' => $request->village_id,

        'address' => $request->address,
      ]);

      $user->save();

      return $user;

    } catch (Exception $error) {
      throw new Exception($error->getMessage(), $error->getCode());
    }
  }

  public function getPostpartumChart(?string $id = null)
  {
    try {
      $postpartums = PostpartumVisit::with([
        'result'
      ])->where('mother_id', '=', $id)->orderBy('visit_number', 'asc')->get();

      $mappingData = [];

      if (sizeof($postpartums) == 0) {
        throw new Exception('data kosong', 404);
      }

      foreach ($postpartums as $postpartum) {
        $mappingData[] = [
          "parameter" => "KF" . $postpartum['visit_number'],
          'value' => $this->classificationPostpartumScore($postpartum['result']['total_score']),
          'risk_category' => category_score($postpartum['result']['total_score']),
          'date_filled' => $postpartum['date_filled']
        ];
      }
      return $mappingData;
    } catch (Exception $error) {
      throw new Exception($error->getMessage(), $error->getCode());
    }
  }

  private function classificationPostpartumScore(int $score)
  {
    if ($score >= 0 && $score <= 6) {
      return 1;
    } else if ($score >= 7 && $score <= 13) {
      return 2;
    } else if ($score >= 14 && $score <= 19) {
      return 3;
    } else {
      return 4;
    }
  }

  public function verification(string $id)
  {
    $user = DB::transaction(function () use ($id) {
      $user = User::findOrFail($id);

      $user->update([
        'is_verified' => !$user->is_verified
      ]);

      return $user;
    });

    return $user;
  }

  public function visit(string $id)
  {
    $user = DB::transaction(function () use ($id) {

      $user = User::findOrFail($id);

      $user->update([
        'is_can_visit' => !$user->is_can_visit
      ]);

      return $user;
    });

    return $user;
  }
}
