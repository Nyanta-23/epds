<?php

namespace App\Service\Patient;

use App\DTO\Request\Patient\PatientUpdateAttributeRequest;
use App\Models\User;
use Illuminate\Support\Facades\DB;

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

  public function getPatients()
  {
    $results = User::with('role')
      ->whereHas('role', function ($query) {
        $query->where('slug', 'patient');
      })
      ->latest()
      ->get();

    return $results;
  }


  public function update(PatientUpdateAttributeRequest $request, string $id)
  {

    return DB::transaction(function () use ($request, $id) {
      User::findOrFail($id)->update([
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
    });
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
