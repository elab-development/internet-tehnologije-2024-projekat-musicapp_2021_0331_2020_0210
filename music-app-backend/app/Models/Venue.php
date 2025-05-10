<?php
// app/Models/Venue.php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Venue extends Model
{
    use HasFactory;

    /**
     * Polja koja mogu biti masovno dodeljena (mass assignable)
     */
    protected $fillable = [
        'name',            // naziv prostora
        'city',            // grad
        'country',         // država
        'address',         // adresa
        'capacity_people', // kapacitet ljudi
        'image_url',       // URL slike prostora
    ];

    /**
     * Veza: prostor može ugostiti više događaja.
     */
    public function events()
    {
        return $this->hasMany(Event::class);
    }
}
