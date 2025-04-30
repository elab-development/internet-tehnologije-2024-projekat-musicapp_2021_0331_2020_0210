<?php
// app/Models/Seat.php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Seat extends Model
{
    use HasFactory;

    // Polja koja mogu biti masovno dodeljena (mass assignable)
    protected $fillable = [
        'position',    // pozicija sedišta, npr. "S1"
        'event_id',    // ID događaja kome sedište pripada
        'is_reserved', // da li je sedište rezervisano (boolean)
    ];

    /**
     * Događaj kome ovo sedište pripada.
     */
    public function event()
    {
        return $this->belongsTo(Event::class);
    }

    /**
     * Sve rezervacije koje uključuju ovo sedište.
     */
    public function reservations()
    {
        return $this->belongsToMany(Reservation::class, 'reservation_seat')
                    ->withTimestamps();
    }
}
