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
        // Učitaj sve kupce sa ulogom "buyer"
        $buyers = User::where('role', 'buyer')->get();
        // Učitaj sve događaje
        $events = Event::all();

        // Prati broj rezervisanih sedišta po događaju
        $eventSeatCounts = [];

        foreach ($buyers as $buyer) {
            // Generiši koliko rezervacija će ovaj kupac kreirati (1–3)
            $count = rand(1, 3); // Smanjeno sa 1–5 na 1–3 da se izbegne previše rezervacija
            for ($i = 0; $i < $count; $i++) {
                $event = $events->random();
                
                // Inicijalizuj brojač za ovaj događaj ako nije postavljen
                if (!isset($eventSeatCounts[$event->id])) {
                    $eventSeatCounts[$event->id] = 0;
                }
                
                // Ne prelazi 80% kapaciteta događaja
                $maxSeatsToReserve = min(
                    3,
                    (int)($event->tickets_capacity * 0.8) - $eventSeatCounts[$event->id]
                );
                
                if ($maxSeatsToReserve <= 0) {
                    // Preskoči ovu iteraciju ako ne možemo rezervisati više sedišta
                    continue;
                }
                
                $numSeats = rand(1, $maxSeatsToReserve);
                
                // Kreiraj rezervaciju sa odgovarajućim brojem sedišta
                $reservation = Reservation::factory()->create([
                    'user_id'         => $buyer->id,
                    'event_id'        => $event->id,
                    'number_of_seats' => $numSeats,
                ]);
                
                // Povećaj brojač za ovaj događaj
                $eventSeatCounts[$event->id] += $numSeats;
            }
        }
        
        // Ažuriraj sve događaje sa tačnim brojem rezervisanih sedišta
        foreach ($eventSeatCounts as $eventId => $count) {
            Event::where('id', $eventId)
                ->update(['tickets_reserved' => $count]);
            // Ispiši u konzolu koliko je sedišta rezervisano
            $this->command->info(
                "Event #{$eventId}: {$count} seats reserved out of " .
                Event::find($eventId)->tickets_capacity
            );
        }
    }
}
