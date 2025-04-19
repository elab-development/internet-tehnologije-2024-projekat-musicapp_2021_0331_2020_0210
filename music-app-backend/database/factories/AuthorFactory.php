<?php
// database/factories/AuthorFactory.php

namespace Database\Factories;

use App\Models\Author;
use GuzzleHttp\Client;
use Illuminate\Database\Eloquent\Factories\Factory;

class AuthorFactory extends Factory
{
    protected $model = Author::class;

    public function definition()
    {
        // A curated list of real artists
        static $artists = [
            'The Beatles',
            'Taylor Swift',
            'Ed Sheeran',
            'Beyoncé',
            'Adele',
            'Coldplay',
            'Bob Dylan',
            'Elton John',
            'Lady Gaga',
            'Drake',
            'Bruno Mars',
            'Billie Eilish',
            'Rihanna',
            'Kendrick Lamar',
            'Jay-Z',
            'Ariana Grande',
            'Justin Bieber',
            'Eminem',
            'Kanye West',
            'Sam Smith',
            'Dua Lipa',
            'Cardi B',
            'Post Malone',
            'Queen',
            'Michael Jackson',
            'Madonna',
            'Prince',
            'U2',
            'Linkin Park',
            'Foo Fighters',
        ];
        

        $name = $this->faker->unique()->randomElement($artists);

        // Query Wikipedia for a thumbnail image
        $client = new Client([
            'base_uri' => 'https://en.wikipedia.org',
            'timeout'  => 2.0,
        ]);

        $response = $client->get('/w/api.php', [
            'query' => [
                'action'       => 'query',
                'titles'       => $name,
                'prop'         => 'pageimages',
                'format'       => 'json',
                'pithumbsize'  => 300,
            ],
        ]);

        $json  = json_decode($response->getBody(), true);
        $pages = $json['query']['pages'] ?? [];
        $page  = reset($pages);

        // Fallback to placeholder if no thumbnail found
        $imageUrl = $page['thumbnail']['source'] 
            ?? $this->faker->imageUrl(300, 300, 'music', true);

        return [
            'name'        => $name,
            'music_genre' => $this->faker->randomElement([
                'Rock','Pop','Jazz','Classical',
                'Hip-Hop','Electronic','Country',
                'Reggae','Metal',
            ]),
            'image_url'   => $imageUrl,
        ];
    }
}
