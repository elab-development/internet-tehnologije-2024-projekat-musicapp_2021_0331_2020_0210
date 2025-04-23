<?php

namespace App\Http\Controllers;

use App\Http\Resources\ReservationResource;
use App\Models\Reservation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ReservationController extends Controller
{
    public function __construct()
    {
        // Protect all routes with Sanctum
        $this->middleware('auth:sanctum');
    }

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
        $user = Auth::user();
        if ($user->role !== 'buyer') {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $reservations = Reservation::with(['event', 'seats'])
            ->where('user_id', $user->id)
            ->get();

        return ReservationResource::collection($reservations);
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
            'event_id'        => 'required|exists:events,id',
            'number_of_seats' => 'required|integer|min:1',
        ]);

        $reservation = Reservation::create([
            'user_id'         => $user->id,
            'event_id'        => $data['event_id'],
            'number_of_seats' => $data['number_of_seats'],
            'status'          => 'pending',
        ]);

        $reservation->load(['event', 'seats']);

        return new ReservationResource($reservation);
    }

    /**
     * PATCH /reservations/{reservation}/status
     * Update the status of a reservation (manager only).
     */
    public function updateStatus(Request $request, Reservation $reservation)
    {
        $user = Auth::user();
        if ($user->role !== 'event_manager' || $reservation->event->manager_id !== $user->id) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $data = $request->validate([
            'status' => 'required|in:pending,confirmed,cancelled',
        ]);

        $reservation->update(['status' => $data['status']]);
        $reservation->load(['user', 'event', 'seats']);

        return new ReservationResource($reservation);
    }

    /**
     * DELETE /reservations/{reservation}
     * Cancel a reservation (buyer only).
     */
    public function delete(Reservation $reservation)
    {
        $user = Auth::user();
        if ($user->role !== 'buyer' || $reservation->user_id !== $user->id) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $reservation->delete();

        return response()->json(null, 204);
    }
}
