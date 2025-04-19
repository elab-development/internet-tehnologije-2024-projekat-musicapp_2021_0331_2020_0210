<?php
// database/seeders/DatabaseSeeder.php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run()
    {
        $this->call([
            UsersSeeder::class,
            VenuesSeeder::class,
            AuthorsSeeder::class,
            EventsSeeder::class,
            SeatsSeeder::class,
            ReservationsSeeder::class,
        ]);
    }
}
