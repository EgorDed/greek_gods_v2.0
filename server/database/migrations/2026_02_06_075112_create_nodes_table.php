<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public array $enumArr = [
        'бог',
        'миф',
        'артефакт',
        'место',
        'событие',
        'герой'
    ];
    public array $enumArrEn = [
        'god',
        'myth',
        'artifact',
        'place',
        'event',
        'hero'
    ];

    public function up(): void
    {
        Schema::create('nodes', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique()->index();
            $table->string('title');
            $table->enum('type', $this->enumArr)->default('бог');
            $table->enum('type_en', $this->enumArrEn)->default('god');
            $table->text('short_description')->nullable();
            $table->longText('description')->nullable();
            $table->json('meta')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('nodes');
    }
};
