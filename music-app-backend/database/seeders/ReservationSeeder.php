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

        foreach ($buyers as $buyer) {
            $count = rand(1, 5);
            for ($i = 0; $i < $count; $i++) {
                Reservation::factory()->create([
                    'user_id'  => $buyer->id,
                    'event_id' => $events->random()->id,
                ]);
            }
        }
    }
}
