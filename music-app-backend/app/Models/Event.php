<?php
// app/Models/Event.php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Event extends Model
{
    use HasFactory;

    // Polja koja se mogu masovno dodeljivati
    protected $fillable = [
        'title',             // Naslov događaja
        'description',       // Opis događaja
        'starts_at',         // Vreme početka
        'ends_at',           // Vreme završetka
        'venue_id',          // ID lokacije (Venue)
        'manager_id',        // ID menadžera događaja (User)
        'author_id',         // ID izvođača/autaora (Author)
        'image_url',         // URL slike događaja
        'tickets_capacity',  // Ukupan kapacitet karata
        'tickets_reserved',  // Broj već rezervisanih karata
    ];

    /**
     * Veza ka lokaciji gde se održava događaj.
     */
    public function venue()
    {
        return $this->belongsTo(Venue::class);
    }

    /**
     * Veza ka korisniku (event_manager) koji upravlja događajem.
     */
    public function manager()
    {
        return $this->belongsTo(User::class, 'manager_id');
    }

    /**
     * Veza ka autoru/izvođaču događaja.
     */
    public function author()
    {
        return $this->belongsTo(Author::class, 'author_id');
    }

    /**
     * Sva sedišta definisana za ovaj događaj.
     */
    public function seats()
    {
        return $this->hasMany(Seat::class);
    }

    /**
     * Sve rezervacije za ovaj događaj.
     */
    public function reservations()
    {
        return $this->hasMany(Reservation::class);
    }

    /**
     * Svi kupci koji prisustvuju ovom događaju putem rezervacija.
     */
    public function attendees()
    {
        return $this->belongsToMany(User::class, 'reservations');
    }
}
