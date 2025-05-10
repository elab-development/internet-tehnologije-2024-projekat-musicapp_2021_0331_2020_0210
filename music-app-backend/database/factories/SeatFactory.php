<?php
// database/factories/SeatFactory.php

namespace Database\Factories;

use App\Models\Seat;
use App\Models\Event;
use Illuminate\Database\Eloquent\Factories\Factory;

class SeatFactory extends Factory
{
    // Model koji fabričimo
    protected $model = Seat::class;

    // Definiše podrazumevano stanje pojedinačnog sedišta
    public function definition()
    {
        // Nasumično odaberi red (slovo A–K)
        $row = chr($this->faker->numberBetween(65, 75)); // A–K
        // Nasumično odaberi broj sedišta u okviru reda (1–30)
        $number = $this->faker->numberBetween(1, 30);

        return [
            // Pozicija sedišta, npr. "A12"
            'position'    => $row . $number,
            // Poveži sa novim, nasumično kreiranim događajem
            'event_id'    => Event::factory(),
            // Po podrazumevanju, sedište nije rezervisano
            'is_reserved' => false,
        ];
    }
}
