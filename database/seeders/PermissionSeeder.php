<?php

namespace Database\Seeders;

use App\Models\Permission;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Permission::create(['name' => 'User View', 'slug' => 'user.view']);
        Permission::create(['name' => 'User Update', 'slug' => 'user.update']);
        Permission::create(['name' => 'User Delete', 'slug' => 'user.delete']);
        Permission::create(['name' => 'User Create', 'slug' => 'user.create']);
        Permission::create(['name' => 'User List', 'slug' => 'user.list']);

        Permission::create(['name' => 'Baby Create', 'slug' => 'baby.create']);
        Permission::create(['name' => 'Baby Edit', 'slug' => 'baby.edit']);
        Permission::create(['name' => 'Baby Delete', 'slug' => 'baby.delete']);
        Permission::create(['name' => 'Baby List', 'slug' => 'baby.list']);

        Permission::create(['name' => 'Postpartum Visit Create', 'slug' => 'postpartum_visit.create']);
        Permission::create(['name' => 'Postpartum Visit List', 'slug' => 'postpartum_visit.list']);

        Permission::create(['name' => 'Answer Create', 'slug' => 'answer.create']);
        Permission::create(['name' => 'Result List', 'slug' => 'result.list']);

        Permission::create(['name' => 'Follow Up Lists', 'slug' => 'followup.lists']);
        Permission::create(['name' => 'Follow Up Create', 'slug' => 'followup.create']);
        Permission::create(['name' => 'Follow Up Update', 'slug' => 'followup.update']);
        Permission::create(['name' => 'Follow Up View', 'slug' => 'followup.view']);

        Permission::create(['name' => 'Question List', 'slug' => 'question.list']);
        Permission::create(['name' => 'Question Option List', 'slug' => 'question_option.list']);

        Permission::create(['name' => 'Recommendation Rule List', 'slug' => 'recomendation_rule.list']);
        Permission::create(['name' => 'Recommendation Variation List', 'slug' => 'recomendation_variation.list']);
        Permission::create(['name' => 'Tone Category List', 'slug' => 'tone_category.list']);

        Permission::create(['name' => 'System Manage Operational', 'slug' => 'system.manage_operational']);
        Permission::create(['name' => 'Export Data', 'slug' => 'export.data']);
        Permission::create(['name' => 'Import Data', 'slug' => 'import.data']);
        Permission::create(['name' => 'Backup Restore One', 'slug' => 'backup.restore.one']);
        Permission::create(['name' => 'Backup Restore By Resource', 'slug' => 'backup.restore.by_resource']);
        Permission::create(['name' => 'Backup Restore All', 'slug' => 'backup.restore.all']);
        Permission::create(['name' => 'System Manage All', 'slug' => 'system.manage_all']);
    }
}
