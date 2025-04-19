<?php
// app/Models/Seat.php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Seat extends Model
{
    use HasFactory;

    protected $fillable = [
        'position',
        'event_id',
    ];

    /**
     * The event this seat belongs to.
     */
    public function event()
    {
        return $this->belongsTo(Event::class);
    }

    /**
     * All reservations that include this seat.
     */
    public function reservations()
    {
        return $this->belongsToMany(Reservation::class, 'reservation_seat')
                    ->withTimestamps();
    }
}
