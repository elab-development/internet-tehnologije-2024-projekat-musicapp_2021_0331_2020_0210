<?php
// app/Models/Reservation.php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Reservation extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'event_id',
        'status',
        // you can drop number_of_seats now if you're using actual seats,
        // or keep it as a cache/summary field
        'number_of_seats',
    ];

    /**
     * The buyer who made this reservation.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * The event being reserved.
     */
    public function event()
    {
        return $this->belongsTo(Event::class);
    }

    /**
     * The seats assigned to this reservation.
     */
    public function seats()
    {
        return $this->belongsToMany(Seat::class, 'reservation_seat')
                    ->withTimestamps();
    }
}
