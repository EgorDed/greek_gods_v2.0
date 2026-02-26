<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    /**
     * Создание администратора для панели управления графом.
     *
     * Email: mr.ded.danilov@yandex.ru
     * Пароль: Ded787898
     *
     * @return void
     */
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'mr.ded.danilov@yandex.ru'],
            [
                'name' => 'Admin',
                'password' => Hash::make('Ded787898'),
            ]
        );
    }
}

