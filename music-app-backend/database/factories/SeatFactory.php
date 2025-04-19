<?php
// database/seeders/SeatsSeeder.php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Seat;
use App\Models\Event;
use Illuminate\Database\Eloquent\Factories\Sequence;

class SeatsSeeder extends Seeder
{
    public function run()
    {
        foreach (Event::all() as $event) {
            // 1) build the full pool A1…A30, B1…B30 … K1…K30
            $positions = [];
            foreach (range('A', 'K') as $row) {
                foreach (range(1, 30) as $num) {
                    $positions[] = $row . $num;
                }
            }

            // 2) shuffle + take exactly 50 unique
            shuffle($positions);
            $selected = array_slice($positions, 0, 50);

            // 3) prepare a Sequence of state‑arrays for the factory
            $states = array_map(function ($pos) use ($event) {
                return [
                    'position' => $pos,
                    'event_id' => $event->id,
                ];
            }, $selected);

            // 4) fire off the factory with the Sequence
            Seat::factory()
                ->count(count($states))
                ->state(new Sequence(...$states))
                ->create();
        }
    }
}
