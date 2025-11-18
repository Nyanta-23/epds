<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Question extends Model
{
    use HasUuids;

    protected $fillable = [
        'question'
    ];


    public function optionQuestions(): HasMany
    {
        return $this->hasMany(OptionQuestion::class);
    }
}
