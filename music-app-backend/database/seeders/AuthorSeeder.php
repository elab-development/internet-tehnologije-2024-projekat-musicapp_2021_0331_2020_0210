<?php
// database/seeders/AuthorsSeeder.php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Author;

class AuthorSeeder extends Seeder
{
    public function run()
    {
        Author::factory()
            ->count(5)
            ->create();
    }
}
