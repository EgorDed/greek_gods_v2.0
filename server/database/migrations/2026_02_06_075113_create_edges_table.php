<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public array $enumArr = [
        'родитель',
        'ребенок',
        'супруг',
        'враг',
        'союзник',
        'владелец',
        'участвует',
        'расположен в'
    ];

    public array $enumArrEn = [
        'parent',
        'child',
        'spouse',
        'enemy',
        'ally',
        'owns',
        'participates',
        'located_in'
    ];

    public function up(): void
    {
        Schema::create('edges', function (Blueprint $table) {
            $table->id();
            $table->enum('type', $this->enumArr)->default('родитель');
            $table->enum('type_en', $this->enumArrEn)->default('parent');
            $table->foreignId('from_node_id');
            $table->foreignId('to_node_id');
            $table->json('meta')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('edges');
    }
};
