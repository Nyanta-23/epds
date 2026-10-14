<?php

/*
 * This file is part of the IndoRegion package.
 *
 * (c) Azis Hapidin <azishapidin.com | azishapidin@gmail.com>
 *
 */

namespace App\Models;

use AzisHapidin\IndoRegion\Traits\DistrictTrait;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * District Model.
 */
class District extends Model
{
    use DistrictTrait, HasFactory;

    /**
     * Table name.
     *
     * @var string
     */
    protected $table = 'districts';

    public $timestamps = false;

    protected $keyType = 'string';

    public $incrementing = false;

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'regency_id',
    ];

    /**
     * District belongs to Regency.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function regency()
    {
        return $this->belongsTo(Regency::class);
    }

    /**
     * District has many villages.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function villages()
    {
        return $this->hasMany(Village::class);
    }
}
