<?php

namespace Database\Factories;

use App\Models\Reservation;
use App\Models\User;
use App\Models\Event;
use Illuminate\Database\Eloquent\Factories\Factory;

class ReservationFactory extends Factory
{
    protected $model = Reservation::class;

    public function definition()
    {
        return [
            'user_id'         => User::factory()->state(['role' => 'buyer']),
            'event_id'        => Event::factory(),
            'status'          => $this->faker->randomElement(['pending','confirmed','cancelled']),
            'number_of_seats' => $this->faker->numberBetween(1, 5),
        ];
    }

    public function configure()
    {
        return $this->afterCreating(function (Reservation $reservation) {
            // pick seats from that event
            $seats = Seat::where('event_id', $reservation->event_id)
                         ->inRandomOrder()
                         ->take($reservation->number_of_seats)
                         ->pluck('id');

            // attach them in the pivot
            $reservation->seats()->attach($seats);
        });
    }
}
