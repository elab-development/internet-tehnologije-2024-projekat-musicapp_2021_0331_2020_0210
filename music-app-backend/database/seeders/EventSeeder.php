<?php
// database/seeders/EventsSeeder.php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Event;
use App\Models\User;
use App\Models\Venue;
use App\Models\Author;

class EventSeeder extends Seeder
{
    public function run()
    {
        $managers = User::where('role', 'event_manager')->get();
        $venues   = Venue::all();
        $authors  = Author::all();

        foreach ($managers as $manager) {
            Event::factory()
                ->count(3)
                ->state(fn() => [
                    'manager_id' => $manager->id,
                    'venue_id'   => $venues->random()->id,
                    'author_id'  => $authors->random()->id,
                ])
                ->create();
        }
    }
}
