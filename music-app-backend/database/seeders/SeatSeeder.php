<?php
// database/seeders/SeatsSeeder.php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Seat;
use App\Models\Event;

class SeatSeeder extends Seeder
{
    public function run()
    {
        foreach (Event::all() as $event) {
            Seat::factory()
                ->count(50)
                ->create(['event_id' => $event->id]);
        }
    }
}
