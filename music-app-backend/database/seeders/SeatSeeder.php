<?php
// database/seeders/SeatSeeder.php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\SeatFactory;
use App\Models\Event;
use App\Models\Seat;

class SeatSeeder extends Seeder
{
    public function run()
    {
        // Define the full auditorium: rows A–K, seats 1–30
        $rows    = range('A','K');      // ['A','B',…,'K']
        $numbers = range(1, 30);        // [1,2,…,30]

        foreach (Event::all() as $event) {
            // Build all possible positions
            $all = [];
            foreach ($rows as $r) {
                foreach ($numbers as $n) {
                    $all[] = $r . $n;
                }
            }

            // Shuffle and take the first 50 distinct ones
            shuffle($all);
            $positions = array_slice($all, 0, 50);

            // Insert them in bulk (or one by one)
            foreach ($positions as $pos) {
                Seat::create([
                    'event_id'       => $event->id,
                    'position'       => $pos,
                    'number_of_seats'=> 1,
                ]);
            }
        }
    }
}
