<?php
// app/Models/Author.php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Author extends Model
{
    use HasFactory;

    // Polja koja su dozvoljena za masovno dodeljivanje (mass assignment)
    protected $fillable = [
        'name',         // Ime autora
        'music_genre',  // Muzički žanr autora
        'image_url',    // URL slike autora
    ];

    /**
     * Veza 1:N – Autor može imati više događaja.
     */
    public function events()
    {
        // Vraća sve događaje kojima je ovaj autor dodeljen
        return $this->hasMany(Event::class, 'author_id');
    }
}
