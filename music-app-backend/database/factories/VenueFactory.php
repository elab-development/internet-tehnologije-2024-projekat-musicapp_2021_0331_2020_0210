<?php
// database/factories/VenueFactory.php

namespace Database\Factories;

use App\Models\Venue;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class VenueFactory extends Factory
{
    // Povezujemo fabriku sa Venue modelom
    protected $model = Venue::class;

    // Definicija nasumičnih vrednosti za Venue
    public function definition()
    {
        // Generišemo ime kompanije kao naziv lokacije
        $name = $this->faker->company();
        // Generišemo naziv grada
        $city = $this->faker->city();
        // Kreiramo "seed" iz naziva i grada za konzistentnu sliku
        $seed = Str::slug($name . '-' . $city);
        // Fiksne dimenzije slike
        $width = 640;
        $height = 480;

        // Vraćamo asocijativni niz sa ključevima koji odgovaraju kolonama u tabeli venues
        return [
            'name'            => $name,                        // naziv prostora
            'city'            => $city,                        // grad
            'country'         => $this->faker->country(),      // država
            'address'         => $this->faker->streetAddress(),// adresa
            'capacity_people' => $this->faker->numberBetween(50, 2000), // kapacitet ljudi
            // URL nasumične slike na osnovu semena
            'image_url'       => "https://picsum.photos/seed/venue-{$seed}/{$width}/{$height}",
        ];
    }
}
