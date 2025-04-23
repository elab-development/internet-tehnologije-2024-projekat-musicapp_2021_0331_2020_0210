<?php
// database/seeders/SeatSeeder.php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Event;
use App\Models\Seat;
use Illuminate\Database\Eloquent\Factories\Sequence;

class SeatSeeder extends Seeder
{
    public function run()
    {
        // Rows A–K, seats 1–30
        $rows    = range('A', 'K');
        $numbers = range(1, 30);

        foreach (Event::all() as $event) {
            // Build every possible position code
            $allPositions = [];
            foreach ($rows as $row) {
                foreach ($numbers as $num) {
                    $allPositions[] = $row . $num;
                }
            }

            // Shuffle and pick exactly 50 unique seats
            shuffle($allPositions);
            $selected = array_slice($allPositions, 0, 50);

            // Prepare a Sequence of state arrays for the factory
            $states = array_map(function ($pos) use ($event) {
                return [
                    'event_id'        => $event->id,
                    'position'        => $pos,
                    // 'number_of_seats' will use the factory default (1)
                ];
            }, $selected);

            // Use the factory with a Sequence to generate seats
            Seat::factory()
                ->count(count($states))
                ->state(new Sequence(...$states))
                ->create();
        }
    }
}
