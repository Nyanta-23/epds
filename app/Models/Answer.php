<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Answer extends Model
{

    use HasFactory, HasUuids;

    protected $fillable = [
        'postpartum_visit_id',
        'question_id',
        'answer',
    ];

    public function postpartumVisit(): BelongsTo
    {
        return $this->belongsTo(PostpartumVisit::class);
    }

    public function question(): BelongsTo
    {
        return $this->belongsTo(Question::class);
    }
}
