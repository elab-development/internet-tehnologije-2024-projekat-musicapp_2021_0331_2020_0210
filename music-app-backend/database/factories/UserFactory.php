<?php
// database/factories/UserFactory.php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;
use GuzzleHttp\Client;

class UserFactory extends Factory
{
    // Model koji fabričimo
    protected $model = User::class;

    // Definiše podrazumevano stanje pojedinačnog korisnika
    public function definition()
    {
        // 1) Izbor pola i generisanje imena koje odgovara polu
        $gender    = $this->faker->randomElement(['male','female']);
        $firstName = $gender === 'male'
            ? $this->faker->firstNameMale()
            : $this->faker->firstNameFemale();
        $lastName  = $this->faker->lastName();
        $name      = "{$firstName} {$lastName}";

        // 2) Fallback URL za sliku sa randomuser.me ako API zakaže
        $seedIndex  = $this->faker->numberBetween(0, 99);
        $fallback   = "https://randomuser.me/api/portraits/"
                    . ($gender === 'male' ? 'men' : 'women')
                    . "/{$seedIndex}.jpg";

        // 3) Pokušaj da se dobije sveža slika preko RandomUser.me API-ja
        $imageUrl = $fallback;
        try {
            $client = new Client(['timeout' => 2.0]);
            $res = $client->get('https://randomuser.me/api/', [
                'query' => [
                    'inc'    => 'picture',
                    'gender' => $gender,
                    'noinfo' => true,
                ],
            ]);
            $data = json_decode($res->getBody(), true);
            if (!empty($data['results'][0]['picture']['large'])) {
                $imageUrl = $data['results'][0]['picture']['large'];
            }
        } catch (\Exception $e) {
            // Ako ne može da učita sa API-ja, koristi fallback
        }

        return [
            // Puno ime korisnika
            'name'           => $name,
            // Jedinstveni email
            'email'          => $this->faker->unique()->safeEmail(),
            // Defaultna lozinka za seeding
            'password'       => bcrypt('password'),
            // Uloga korisnika nasumično odabrana
            'role'           => $this->faker->randomElement(['event_manager','buyer','administrator']),
            // Nasumična adresa
            'address'        => $this->faker->address(),
            // Nasumičan broj telefona
            'phone'          => $this->faker->phoneNumber(),
            // URL korisničke slike
            'image_url'      => $imageUrl,
            // Token za "zapamti me"
            'remember_token' => Str::random(10),
        ];
    }
}
