<?php

namespace Database\Factories;

use App\Models\Venue;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class VenueFactory extends Factory
{
    protected $model = Venue::class;

    public function definition()
    {
        $name = $this->faker->company();
        $city = $this->faker->city();
        $seed = Str::slug($name.'-'.$city);
        $width = 640;
        $height = 480;

        return [
            'name'            => $name,
            'city'            => $city,
            'country'         => $this->faker->country(),
            'address'         => $this->faker->streetAddress(),
            'capacity_people' => $this->faker->numberBetween(50, 2000),
            'image_url'       => "https://picsum.photos/seed/venue-{$seed}/{$width}/{$height}",
        ];
    }
}
