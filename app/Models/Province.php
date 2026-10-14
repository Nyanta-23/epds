<?php

/*
 * This file is part of the IndoRegion package.
 *
 * (c) Azis Hapidin <azishapidin.com | azishapidin@gmail.com>
 *
 */

namespace App\Models;

use AzisHapidin\IndoRegion\Traits\ProvinceTrait;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * Province Model.
 */
class Province extends Model
{
    use HasFactory, ProvinceTrait;

    /**
     * Table name.
     *
     * @var string
     */
    protected $table = 'provinces';

    protected $keyType = 'string';

    public $incrementing = false;

    public $timestamps = false;

    /**
     * Province has many regencies.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function regencies()
    {
        return $this->hasMany(Regency::class);
    }
}
