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
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',         // enum: event_manager|buyer|administrator
        'address',
        'phone',
        'image_url',
    ];

    /**
     * The attributes that should be hidden for arrays.
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * A buyer’s reservations.
     */
    public function reservations()
    {
        return $this->hasMany(Reservation::class);
    }

    /**
     * The events this user has booked (via reservations).
     */
    public function reservedEvents()
    {
        return $this->belongsToMany(Event::class, 'reservations');
    }

    /**
     * If role == event_manager, the events they manage.
     */
    public function managedEvents()
    {
        return $this->hasMany(Event::class, 'manager_id');
    }
}
