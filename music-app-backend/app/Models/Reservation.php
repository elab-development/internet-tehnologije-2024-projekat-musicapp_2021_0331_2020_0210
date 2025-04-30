<?php
// app/Models/Reservation.php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Reservation extends Model
{
    use HasFactory;

    // Polja koja se mogu masovno dodeljivati
    protected $fillable = [
        'user_id',           // ID kupca koji rezerviše
        'event_id',          // ID događaja koji se rezerviše
        'status',            // Status rezervacije (pending, confirmed, cancelled)
        'number_of_seats',   // Broj rezervisanih sedišta (može se koristiti kao keš polje)
    ];

    /**
     * Kupac koji je napravio ovu rezervaciju.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Događaj koji se rezerviše.
     */
    public function event()
    {
        return $this->belongsTo(Event::class);
    }

    /**
     * Sedišta povezana sa ovom rezervacijom (pivot tabela reservation_seat).
     */
    public function seats()
    {
        return $this->belongsToMany(Seat::class, 'reservation_seat')
                    ->withTimestamps();
    }
}
