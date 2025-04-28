<?php
// database/seeders/ReservationsSeeder.php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Reservation;
use App\Models\User;
use App\Models\Event;

class ReservationSeeder extends Seeder
{
    public function run()
    {
        $buyers = User::where('role', 'buyer')->get();
        $events = Event::all();

        // Track seat counts per event
        $eventSeatCounts = [];

        foreach ($buyers as $buyer) {
            $count = rand(1, 3); // Reduced from 1-5 to 1-3 to avoid too many reservations
            for ($i = 0; $i < $count; $i++) {
                $event = $events->random();
                
                // Initialize counter for this event if not set
                if (!isset($eventSeatCounts[$event->id])) {
                    $eventSeatCounts[$event->id] = 0;
                }
                
                // Don't exceed 80% of event capacity
                $maxSeatsToReserve = min(3, (int)($event->tickets_capacity * 0.8) - $eventSeatCounts[$event->id]);
                
                if ($maxSeatsToReserve <= 0) {
                    // Skip this iteration if we can't reserve more seats
                    continue;
                }
                
                $numSeats = rand(1, $maxSeatsToReserve);
                
                $reservation = Reservation::factory()->create([
                    'user_id'         => $buyer->id,
                    'event_id'        => $event->id,
                    'number_of_seats' => $numSeats,
                ]);
                
                // Increment count for this event
                $eventSeatCounts[$event->id] += $numSeats;
            }
        }
        
        // Update all events with their correct number of reserved seats
        foreach ($eventSeatCounts as $eventId => $count) {
            Event::where('id', $eventId)->update(['tickets_reserved' => $count]);
            $this->command->info("Event #{$eventId}: {$count} seats reserved out of " . Event::find($eventId)->tickets_capacity);
        }
    }
}
