<?php
// database/seeders/VenuesSeeder.php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Venue;

class VenueSeeder extends Seeder
{
    public function run()
    {
        Venue::factory()
            ->count(3)
            ->create();
    }
}
