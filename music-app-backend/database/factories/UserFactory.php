<?php
// database/factories/UserFactory.php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;
use GuzzleHttp\Client;

class UserFactory extends Factory
{
    protected $model = User::class;

    public function definition()
    {
        // 1) Pick a gender and build a matching name
        $gender    = $this->faker->randomElement(['male','female']);
        $firstName = $gender === 'male'
            ? $this->faker->firstNameMale()
            : $this->faker->firstNameFemale();
        $lastName  = $this->faker->lastName();
        $name      = "{$firstName} {$lastName}";

        // 2) Fallback static portrait in case API fails
        $seedIndex  = $this->faker->numberBetween(0, 99);
        $fallback   = "https://randomuser.me/api/portraits/"
                    . ($gender==='male' ? 'men' : 'women')
                    . "/{$seedIndex}.jpg";

        // 3) Try fetching a fresh one from RandomUser.me
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
            // network failed, stick with fallback
        }

        return [
            'name'            => $name,
            'email'           => $this->faker->unique()->safeEmail(),
            'password'        => bcrypt('password'),
            'role'            => $this->faker->randomElement(['event_manager','buyer','administrator']),
            'address'         => $this->faker->address(),
            'phone'           => $this->faker->phoneNumber(),
            'image_url'       => $imageUrl,
            'remember_token'  => Str::random(10),
        ];
    }
}
