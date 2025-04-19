<?php
// app/Models/Event.php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Event extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'starts_at',
        'ends_at',
        'venue_id',
        'manager_id',
        'author_id',
        'image_url',
        'tickets_capacity',
        'tickets_reserved',
    ];

    /**
     * Venue where this event takes place.
     */
    public function venue()
    {
        return $this->belongsTo(Venue::class);
    }

    /**
     * User (role=event_manager) who manages this event.
     */
    public function manager()
    {
        return $this->belongsTo(User::class, 'manager_id');
    }

    /**
     * Performing artist/author of this event.
     */
    public function author()
    {
        return $this->belongsTo(Author::class, 'author_id');
    }

    /**
     * All seats defined for this event.
     */
    public function seats()
    {
        return $this->hasMany(Seat::class);
    }

    /**
     * All reservations for this event.
     */
    public function reservations()
    {
        return $this->hasMany(Reservation::class);
    }

    /**
     * Buyers attending this event (via reservations pivot).
     */
    public function attendees()
    {
        return $this->belongsToMany(User::class, 'reservations');
    }
}
