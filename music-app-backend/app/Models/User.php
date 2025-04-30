<?php
// app/Models/User.php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasFactory, Notifiable, HasApiTokens;

    /**
     * Polja koja mogu biti masovno dodeljena (mass assignable).
     */
    protected $fillable = [
        'name',       // ime korisnika
        'email',      // email adresa
        'password',   // šifrovana lozinka
        'role',       // uloga: event_manager | buyer | administrator
        'address',    // adresa korisnika
        'phone',      // broj telefona
        'image_url',  // URL do korisničke slike
    ];

    /**
     * Polja koja se sakrivaju pri konvertovanju u nizove/JSON.
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Rezervacije koje je ovaj kupac napravio.
     */
    public function reservations()
    {
        return $this->hasMany(Reservation::class);
    }

    /**
     * Događaji koje je ovaj korisnik rezervisao (putem pivot tabele reservations).
     */
    public function reservedEvents()
    {
        return $this->belongsToMany(Event::class, 'reservations');
    }

    /**
     * Događaji kojima upravlja ovaj menadžer (ako je role == event_manager).
     */
    public function managedEvents()
    {
        return $this->hasMany(Event::class, 'manager_id');
    }
}
