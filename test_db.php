<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Baby;
use App\Models\PostpartumVisit;
use Carbon\Carbon;

$babies = Baby::with('mother')->get();
echo "Total Babies: " . count($babies) . "\n";
foreach($babies as $b) {
    if(!$b->mother) continue;
    $hours = Carbon::parse($b->date_of_birth)->diffInHours(now(), false);
    echo "Baby {$b->id} age in hours: {$hours}\n";
    $kf = PostpartumVisit::where('baby_id', $b->id)->get();
    foreach($kf as $v) {
        echo " - Visit {$v->visit_number}\n";
    }
}
