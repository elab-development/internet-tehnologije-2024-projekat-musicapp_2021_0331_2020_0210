<?php
// app/Http/Controllers/SeatController.php

namespace App\Http\Controllers;

use App\Http\Resources\SeatResource;
use App\Models\Seat;
use App\Models\Event;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class SeatController extends Controller
{
    /**
     * GET /seats
     * Public: list all seats.
     */
    public function index()
    {
        $seats = Seat::with('reservations')->get();
        return SeatResource::collection($seats);
    }

    /**
     * GET /seats/{id}
     * Public: show a single seat by id.
     */
    public function show($id)
    {
        $seat = Seat::with('reservations')->findOrFail($id);
        return new SeatResource($seat);
    }
    
    /**
     * POST /events/{id}/seats
     * Protected: create multiple seats for an event.
     * Only the event manager can create seats for their events.
     */
    public function createForEvent(Request $request, $eventId)
    {
        // Find the event
        $event = Event::findOrFail($eventId);
        
        // Check if the authenticated user is the event manager
        $user = Auth::user();
        if ($user->id !== $event->manager_id && $user->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        
        // Validate request data
        $validatedData = $request->validate([
            'seats' => 'required|array',
            'seats.*.position' => 'required|string',
            'seats.*.is_reserved' => 'boolean',
        ]);
        
        // Log the incoming seats data
        Log::info('Creating seats for event', [
            'event_id' => $eventId,
            'seats_count' => count($validatedData['seats']),
            'sample_positions' => array_slice(array_column($validatedData['seats'], 'position'), 0, 10)
        ]);
        
        $createdSeats = [];
        
        // Create all seats in a single transaction
        \DB::transaction(function () use ($event, $validatedData, &$createdSeats) {
            // First, clear any existing seats for this event
            Seat::where('event_id', $event->id)->delete();
            
            // Create new seats with row information
            foreach ($validatedData['seats'] as $seatData) {
                $seat = new Seat([
                    'position' => $seatData['position'],
                    'event_id' => $event->id,
                    'is_reserved' => $seatData['is_reserved'] ?? false, // Default to false if not provided
                ]);
                
                $seat->save();
                $createdSeats[] = $seat;
            }
            
            // Update event tickets capacity to match the number of seats
            $event->tickets_capacity = count($createdSeats);
            $event->save();
        });
        
        return SeatResource::collection(collect($createdSeats));
    }
}
