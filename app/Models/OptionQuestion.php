<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class OptionQuestion extends Model
{
    use HasUuids;

    public function question(): BelongsTo
    {
        return $this->belongsTo(Question::class);
    }
}
