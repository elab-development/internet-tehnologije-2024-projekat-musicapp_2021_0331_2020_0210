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
        foreach (Event::all() as $event) {
            // Define how many seats we need
            $seatsNeeded = $event->tickets_capacity;
            
            // Define how many seats per row (19 seats per row in the first row like in the image)
            $seatsPerRow = 19;
            
            // Calculate how many complete rows we need
            $completeRows = floor($seatsNeeded / $seatsPerRow);
            
            // Calculate how many seats in the last row
            $remainingSeats = $seatsNeeded % $seatsPerRow;
            
            // Prepare the states for all seats
            $states = [];
            $seatCount = 1;
            
            // Create complete rows
            for ($row = 0; $row < $completeRows; $row++) {
                for ($seat = 0; $seat < $seatsPerRow; $seat++) {
                    $states[] = [
                        'event_id'    => $event->id,
                        'position'    => "S{$seatCount}",
                        'is_reserved' => false,
                    ];
                    $seatCount++;
                }
            }
            
            // Create the last row if needed
            for ($seat = 0; $seat < $remainingSeats; $seat++) {
                $states[] = [
                    'event_id'    => $event->id,
                    'position'    => "S{$seatCount}",
                    'is_reserved' => false,
                ];
                $seatCount++;
            }
            
            // Use the factory with a Sequence to generate seats
            Seat::factory()
                ->count(count($states))
                ->state(new Sequence(...$states))
                ->create();
            
            // Log for debugging
            $this->command->info("Created {$seatsNeeded} seats for Event #{$event->id}: {$event->title}");
        }
    }
}
