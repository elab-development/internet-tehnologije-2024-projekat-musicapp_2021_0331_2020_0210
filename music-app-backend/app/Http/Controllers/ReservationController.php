<?php

namespace App\Http\Controllers;

use App\Http\Resources\ReservationResource;
use App\Models\Reservation;
use App\Models\Event;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class ReservationController extends Controller
{
    /**
     * GET /reservations/events
     * Show all reservations for events managed by the authenticated manager.
     */
    public function showAllOfOrdersForMyEvents()
    {
        $user = Auth::user();
        if ($user->role !== 'event_manager') {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $reservations = Reservation::with(['user', 'event', 'seats'])
            ->whereHas('event', fn($q) => $q->where('manager_id', $user->id))
            ->get();

        return ReservationResource::collection($reservations);
    }

    /**
     * GET /reservations/my
     * Show all reservations made by the authenticated buyer.
     */
    public function showAllOfMyOrders()
    {
        try {
            $user = Auth::user();
            
            // Log user details for debugging
            Log::info('User attempting to view their reservations', [
                'user_id' => $user ? $user->id : 'null',
                'user_role' => $user ? $user->role : 'null',
                'authenticated' => Auth::check()
            ]);
            
            if (!$user) {
                return response()->json(['message' => 'Unauthenticated'], 401);
            }
            
            if ($user->role !== 'buyer') {
                return response()->json([
                    'message' => 'Forbidden - Only buyers can view their reservations',
                    'user_role' => $user->role
                ], 403);
            }

            $reservations = Reservation::with(['event', 'event.venue', 'event.author', 'event.manager', 'seats'])
                ->where('user_id', $user->id)
                ->get();
                
            Log::info('Found reservations for user', [
                'user_id' => $user->id,
                'count' => $reservations->count(),
                'reservations' => $reservations->pluck('id')->toArray()
            ]);

            return ReservationResource::collection($reservations);
        } catch (\Exception $e) {
            Log::error('Error fetching user reservations: ' . $e->getMessage(), [
                'exception' => $e,
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'message' => 'An error occurred while fetching your reservations',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * POST /reservations
     * Create a new reservation (buyer only).
     */
    public function store(Request $request)
    {
        $user = Auth::user();
        if ($user->role !== 'buyer') {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $data = $request->validate([
            'event_id' => 'required|exists:events,id',
            'seats' => 'required|array|min:1',
            'seats.*' => 'exists:seats,id',
        ]);

        $number_of_seats = count($data['seats']);
        $event_id = $data['event_id'];

        // Use DB transaction to ensure all operations succeed or fail together
        DB::beginTransaction();
        
        try {
            // Create the reservation
            $reservation = Reservation::create([
                'user_id' => $user->id,
                'event_id' => $event_id,
                'number_of_seats' => $number_of_seats,
                'status' => 'pending',
            ]);

            // Attach the selected seats to the reservation
            $reservation->seats()->attach($data['seats']);

            // Update the event's tickets_reserved count
            Event::where('id', $event_id)->increment('tickets_reserved', $number_of_seats);

            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Failed to create reservation: ' . $e->getMessage());
            return response()->json(['message' => 'Could not create reservation. Please try again.'], 500);
        }

        // Load relationships for the response
        $reservation->load(['event', 'seats', 'user']);

        return new ReservationResource($reservation);
    }

    /**
     * PATCH /reservations/{id}/status
     * Update the status of a reservation (manager only).
     */
    public function updateStatus(Request $request, $id)
    {
        $user = Auth::user();

        // Manually resolve or 404
        $reservation = Reservation::findOrFail($id);

        // Authorization check
        if ($user->role !== 'event_manager' || $reservation->event->manager_id !== $user->id) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $data = $request->validate([
            'status' => 'required|in:pending,confirmed,cancelled',
        ]);

        // If changing from confirmed/pending to cancelled, we should decrement the tickets_reserved count
        if ($data['status'] === 'cancelled' && $reservation->status !== 'cancelled') {
            Event::where('id', $reservation->event_id)
                 ->decrement('tickets_reserved', $reservation->number_of_seats);
        }
        // If changing from cancelled to confirmed/pending, we should increment the tickets_reserved count
        else if ($data['status'] !== 'cancelled' && $reservation->status === 'cancelled') {
            Event::where('id', $reservation->event_id)
                 ->increment('tickets_reserved', $reservation->number_of_seats);
        }

        $reservation->update(['status' => $data['status']]);
        $reservation->load(['user', 'event', 'seats']);

        return new ReservationResource($reservation);
    }

    /**
     * DELETE /reservations/{id}
     * Cancel a reservation (buyer only).
     */
    public function delete(Request $request, $id)
    {
        $user = Auth::user();

        // Manually resolve or 404
        $reservation = Reservation::findOrFail($id);

        // Authorization check
        if ($user->role !== 'buyer' || $reservation->user_id !== $user->id) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        // Get the number of seats to decrement from the event
        $number_of_seats = $reservation->number_of_seats;
        $event_id = $reservation->event_id;

        DB::beginTransaction();
        
        try {
            // Delete the reservation
            $reservation->delete();
            
            // Decrement the event's tickets_reserved count
            if ($reservation->status !== 'cancelled') {
                Event::where('id', $event_id)
                     ->decrement('tickets_reserved', $number_of_seats);
            }
            
            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Failed to delete reservation: ' . $e->getMessage());
            return response()->json(['message' => 'Could not delete reservation. Please try again.'], 500);
        }

        return response()->json([
            'message' => 'Reservation deleted successfully!'
        ], 200);
    }
}
