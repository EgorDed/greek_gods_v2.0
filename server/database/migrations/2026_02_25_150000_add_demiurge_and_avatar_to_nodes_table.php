<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        DB::statement("ALTER TABLE nodes MODIFY COLUMN type ENUM(
            'бог', 'миф', 'артефакт', 'место', 'событие', 'герой', 'демиург'
        ) DEFAULT 'бог'");

        DB::statement("ALTER TABLE nodes MODIFY COLUMN type_en ENUM(
            'god', 'myth', 'artifact', 'place', 'event', 'hero', 'demiurge'
        ) DEFAULT 'god'");

        Schema::table('nodes', function (Blueprint $table): void {
            $table->string('avatar')->nullable()->after('description');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('nodes', function (Blueprint $table): void {
            $table->dropColumn('avatar');
        });

        DB::statement("ALTER TABLE nodes MODIFY COLUMN type ENUM(
            'бог', 'миф', 'артефакт', 'место', 'событие', 'герой'
        ) DEFAULT 'бог'");

        DB::statement("ALTER TABLE nodes MODIFY COLUMN type_en ENUM(
            'god', 'myth', 'artifact', 'place', 'event', 'hero'
        ) DEFAULT 'god'");
    }
};

