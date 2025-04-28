<?php
// database/factories/AuthorFactory.php

namespace Database\Factories;

use App\Models\Author;
use GuzzleHttp\Client;
use GuzzleHttp\Exception\ConnectException;
use GuzzleHttp\Exception\RequestException;
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
        $imageUrl = null;

        // Try to get image from Wikipedia API
        try {
            // Query Wikipedia for a thumbnail image
            $client = new Client([
                'base_uri' => 'https://en.wikipedia.org',
                'timeout'  => 3.0, // Increased timeout
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

            // Get thumbnail if available
            if (isset($page['thumbnail']['source'])) {
                $imageUrl = $page['thumbnail']['source'];
            }
        } catch (ConnectException | RequestException $e) {
            // Log the error but continue with fallback
            echo "Wikipedia API error for {$name}: {$e->getMessage()}. Using placeholder instead.\n";
        }

        // Fallback to placeholder if no image from Wikipedia
        if (!$imageUrl) {
            $imageUrl = "https://via.placeholder.com/300x300.png?text=" . urlencode($name);
        }

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
