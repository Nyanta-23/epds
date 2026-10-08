<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class FacilityType extends Model
{
    use HasFactory, HasUuids, SoftDeletes;

    protected $table = 'facility_types';

    protected $fillable = [
        'name',
        'is_deleted',
    ];

    protected $casts = [
        'is_deleted' => 'boolean',
    ];

    protected $hidden = [
        'is_deleted',
        'deleted_at',
    ];

    public function facilities(): HasMany
    {
        return $this->hasMany(Facility::class, 'facility_type_id', 'id');
    }
}
