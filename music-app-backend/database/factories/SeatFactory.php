<?php

namespace Database\Factories;

use App\Models\Seat;
use App\Models\Event;
use Illuminate\Database\Eloquent\Factories\Factory;

class SeatFactory extends Factory
{
    protected $model = Seat::class;

    public function definition()
    {
        // e.g. "A12", "B7", "K30"
        $row    = chr($this->faker->numberBetween(65, 75)); // ASCII 65–75 = A–K
        $number = $this->faker->numberBetween(1, 30);

        return [
            'number_of_seats' => 1,
            'position'        => $row.$number,
            'event_id'        => Event::factory(),
        ];
    }
}
