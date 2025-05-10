<?php

namespace Database\Factories;

use App\Models\Reservation;
use App\Models\User;
use App\Models\Event;
use App\Models\Seat;
use Illuminate\Database\Eloquent\Factories\Factory;

class ReservationFactory extends Factory
{
    protected $model = Reservation::class;

    public function definition()
    {
        // Generišemo rezervaciju za nasumičnog buyer-a na novom događaju
        return [
            'user_id'         => User::factory()->state(['role' => 'buyer']),
            'event_id'        => Event::factory(),
            'status'          => $this->faker->randomElement(['pending', 'confirmed', 'cancelled']),
            'number_of_seats' => $this->faker->numberBetween(1, 5),
        ];
    }

    public function configure()
    {
        // Nakon što rezervacija bude sačuvana, vezujemo odgovarajuća sedišta
        return $this->afterCreating(function (Reservation $reservation) {
            // Izaberemo nasumična sedišta iz skupa sedišta za dati događaj
            $seatIds = Seat::where('event_id', $reservation->event_id)
                ->inRandomOrder()
                ->take($reservation->number_of_seats)
                ->pluck('id');

            // Prikačujemo ta sedišta u pivot tabelu reservation_seat
            $reservation->seats()->attach($seatIds);
        });
    }
}
