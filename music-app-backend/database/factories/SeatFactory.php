<?php
// database/factories/SeatFactory.php

namespace Database\Factories;

use App\Models\Seat;
use App\Models\Event;
use Illuminate\Database\Eloquent\Factories\Factory;

class SeatFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Seat::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        // Generate a default random position (will be overridden by Seeder Sequence)
        $row    = chr($this->faker->numberBetween(65, 75)); // A–K
        $number = $this->faker->numberBetween(1, 30);

        return [
            'position'        => $row . $number,
            'event_id'        => Event::factory(),
            'is_reserved'     => false,
        ];
    }
}
