<?php
// app/Models/Venue.php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Venue extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'city',
        'country',
        'address',
        'capacity_people',
        'image_url',
    ];

    /**
     * A venue hosts many events.
     */
    public function events()
    {
        return $this->hasMany(Event::class);
    }
}
