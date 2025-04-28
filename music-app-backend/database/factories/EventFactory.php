<?php
// database/factories/EventFactory.php

namespace Database\Factories;

use App\Models\Event;
use App\Models\Venue;
use App\Models\User;
use App\Models\Author;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class EventFactory extends Factory
{
    protected $model = Event::class;

    public function definition()
    {
        // 1–30 days from now, duration 1–4 hours
        $start = $this->faker->dateTimeBetween('+1 days', '+30 days');
        $end   = (clone $start)->modify('+'.$this->faker->numberBetween(1, 4).' hours');

        // Build a "seed" from the title so Picsum returns a consistent image per event
        $title    = $this->faker->sentence(3);
        $seed     = Str::slug($title);
        $width    = 640;
        $height   = 480;
        $imageUrl = "https://picsum.photos/seed/music-event-{$seed}/{$width}/{$height}";

        // Set tickets_capacity to a more reasonable range for better UI display
        $ticketsCapacity = $this->faker->numberBetween(30, 100);

        return [
            'title'            => $title,
            'description'      => $this->faker->paragraph(),
            'starts_at'        => $start,
            'ends_at'          => $end,
            'venue_id'         => Venue::factory(),
            'manager_id'       => User::factory()->state(['role' => 'event_manager']),
            'author_id'        => Author::factory(),
            'image_url'        => $imageUrl,
            'tickets_capacity' => $ticketsCapacity,
            'tickets_reserved' => $this->faker->numberBetween(0, min(20, (int)($ticketsCapacity * 0.2))),
        ];
    }
}
