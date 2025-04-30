<?php
// app/Http/Controllers/SeatController.php

namespace App\Http\Controllers;

use App\Http\Resources\SeatResource;
use App\Models\Seat;
use App\Models\Event;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class SeatController extends Controller
{
    /**
     * GET /seats
     * Javno: lista svih sedišta.
     */
    public function index()
    {
        // Učitavamo sva sedišta zajedno sa rezervacijama
        $seats = Seat::with('reservations')->get();
        return SeatResource::collection($seats);
    }

    /**
     * GET /seats/{id}
     * Javno: prikaz jednog sedišta po ID-ju.
     */
    public function show($id)
    {
        // Pronalazimo sedište ili vratimo 404 grešku
        $seat = Seat::with('reservations')->findOrFail($id);
        return new SeatResource($seat);
    }
    
    /**
     * POST /events/{id}/seats
     * Zaštićeno: kreiranje više sedišta za dati događaj.
     * Samo menadžer događaja ili administrator može ovo da izvede.
     */
    public function createForEvent(Request $request, $eventId)
    {
        // Pronalazimo događaj ili vraćamo 404
        $event = Event::findOrFail($eventId);
        
        // Provera autorizacije: samo menadžer događaja ili admin
        $user = Auth::user();
        if ($user->id !== $event->manager_id && $user->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        
        // Validiramo ulazne podatke
        $validatedData = $request->validate([
            'seats'               => 'required|array',
            'seats.*.position'    => 'required|string',
            'seats.*.is_reserved' => 'boolean',
        ]);
        
        $createdSeats = [];
        
        // Kreiramo sedišta unutar transakcije radi sigurnosti
        \DB::transaction(function () use ($event, $validatedData, &$createdSeats) {
            // Brišemo postojeća sedišta za događaj
            Seat::where('event_id', $event->id)->delete();
            
            // Kreiramo nova sedišta
            foreach ($validatedData['seats'] as $seatData) {
                $seat = new Seat([
                    'position'    => $seatData['position'],
                    'event_id'    => $event->id,
                    'is_reserved' => $seatData['is_reserved'] ?? false, // podrazumevano false
                ]);
                
                $seat->save();
                $createdSeats[] = $seat;
            }
            
            // Ažuriramo kapacitet karata događaja na novi broj sedišta
            $event->tickets_capacity = count($createdSeats);
            $event->save();
        });
        
        // Vraćamo novokreirana sedišta kao resurs
        return SeatResource::collection(collect($createdSeats));
    }
}
