<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Добавление типа связи «брат» / "brother" в enum колонки edges.
     *
     * @return void
     */
    public function up(): void
    {
        DB::statement("ALTER TABLE edges MODIFY COLUMN type ENUM(
            'родитель', 'ребенок', 'супруг', 'брат', 'враг', 'союзник', 'владелец', 'участвует', 'расположен в'
        ) DEFAULT 'родитель'");
        DB::statement("ALTER TABLE edges MODIFY COLUMN type_en ENUM(
            'parent', 'child', 'spouse', 'brother', 'enemy', 'ally', 'owns', 'participates', 'located_in'
        ) DEFAULT 'parent'");
    }

    /**
     * @return void
     */
    public function down(): void
    {
        DB::statement("ALTER TABLE edges MODIFY COLUMN type ENUM(
            'родитель', 'ребенок', 'супруг', 'враг', 'союзник', 'владелец', 'участвует', 'расположен в'
        ) DEFAULT 'родитель'");
        DB::statement("ALTER TABLE edges MODIFY COLUMN type_en ENUM(
            'parent', 'child', 'spouse', 'enemy', 'ally', 'owns', 'participates', 'located_in'
        ) DEFAULT 'parent'");
    }
};
