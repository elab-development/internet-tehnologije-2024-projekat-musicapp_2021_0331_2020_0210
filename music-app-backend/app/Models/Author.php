<?php
// app/Models/Author.php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Author extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'music_genre',
        'image_url',
    ];

    /**
     * An author can be linked to many events.
     */
    public function events()
    {
        return $this->hasMany(Event::class, 'author_id');
    }
}
