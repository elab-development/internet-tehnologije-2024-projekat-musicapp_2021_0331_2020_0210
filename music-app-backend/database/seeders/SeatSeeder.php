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
        // Prolazimo kroz sve događaje
        foreach (Event::all() as $event) {
            // Odredimo koliko sedišta je potrebno
            $seatsNeeded = $event->tickets_capacity;
            
            // Broj sedišta po redu
            $seatsPerRow = 19;
            
            // Koliko kompletnih redova treba
            $completeRows = floor($seatsNeeded / $seatsPerRow);
            
            // Koliko sedišta ostaje za poslednji red
            $remainingSeats = $seatsNeeded % $seatsPerRow;
            
            // Pripremamo niz stanja za sva sedišta
            $states = [];
            $seatCount = 1;
            
            // Kreiramo kompletne redove
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
            
            // Kreiramo preostala sedišta u poslednjem redu
            for ($seat = 0; $seat < $remainingSeats; $seat++) {
                $states[] = [
                    'event_id'    => $event->id,
                    'position'    => "S{$seatCount}",
                    'is_reserved' => false,
                ];
                $seatCount++;
            }
            
            // Generišemo sedišta pomoću fabrike i Sequence stanja
            Seat::factory()
                ->count(count($states))
                ->state(new Sequence(...$states))
                ->create();
            
            // Ispis poruke za debagovanje
            $this->command->info("Created {$seatsNeeded} seats for Event #{$event->id}: {$event->title}");
        }
    }
}
