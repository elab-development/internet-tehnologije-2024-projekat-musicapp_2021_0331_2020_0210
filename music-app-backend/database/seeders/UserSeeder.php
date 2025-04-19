<?php
// database/seeders/UsersSeeder.php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Str;

class UserSeeder extends Seeder
{
    public function run()
    {
        // 1 admin with fixed credentials
        User::factory()->create([
            'name'            => 'Administrator',
            'email'           => 'administrator123@gmail.com',
            'password'        => bcrypt('administrator123'),
            'role'            => 'administrator',
            'address'         => fake()->address(),
            'phone'           => fake()->phoneNumber(),
            'image_url'       => fake()->imageUrl(200,200,'people',true),
            'remember_token'  => Str::random(10),
        ]);

        // 2 event managers
        User::factory()
            ->count(2)
            ->state(['role' => 'event_manager'])
            ->create();

        // 5 buyers
        User::factory()
            ->count(5)
            ->state(['role' => 'buyer'])
            ->create();
    }
}
