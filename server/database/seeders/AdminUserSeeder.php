<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    /**
     * Создание администратора для панели управления графом.
     * Учётные данные задаются через переменные окружения:
     * ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_NAME.
     *
     * @return void
     */
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => env('ADMIN_EMAIL', 'admin@example.com')],
            [
                'name'     => env('ADMIN_NAME', 'Admin'),
                'password' => Hash::make(env('ADMIN_PASSWORD', 'change_me')),
            ]
        );
    }
}

