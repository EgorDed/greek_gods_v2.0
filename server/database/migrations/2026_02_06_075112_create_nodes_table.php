<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public array $enumArr = [
        'бог',
        'миф',
        'артефакт',
        'место',
        'событие',
        'герой',
        'демиург',
        'персонофикация',
        'титан',
        'гигант',
        'океанида',
        'смертный',
    ];

    public array $enumArrEn = [
        'god',
        'myth',
        'artifact',
        'place',
        'event',
        'hero',
        'demiurge',
        'personification',
        'titan',
        'giant',
        'oceanid',
        'mortal',
    ];

    public function up(): void
    {
        Schema::create('nodes', function (Blueprint $table): void {
            $table->id();
            $table->string('code')->unique()->index();
            $table->string('title');
            $table->enum('type', $this->enumArr)->default('бог');
            $table->enum('type_en', $this->enumArrEn)->default('god');
            $table->text('short_description')->nullable();
            $table->longText('description')->nullable();
            $table->string('avatar')->nullable();
            $table->string('icon')->nullable();
            $table->jsonb('meta')->nullable();
            $table->double('x')->default(0);
            $table->double('y')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('nodes');
    }
};
