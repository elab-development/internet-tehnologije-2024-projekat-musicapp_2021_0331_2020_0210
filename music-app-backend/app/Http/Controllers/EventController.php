<?php

namespace App\Http\Controllers;

use App\Http\Resources\EventResource;
use App\Models\Event;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class EventController extends Controller
{
    /**
     * GET /events
     * Everyone except administrators
     */
    public function index()
    {
        $user = Auth::user();
        if ($user->role === 'administrator') {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $events = Event::with(['venue', 'manager', 'author'])->get();
        return EventResource::collection($events);
    }

    /**
     * GET /events/{event}
     * Everyone except administrators
     */
    public function show($id)
    {
        $user = Auth::user();
        if ($user->role === 'administrator') {
            return response()->json(['message' => 'Forbidden'], 403);
        }
    
        // Manually fetch or 404
        $event = Event::with(['venue','manager','author','seats','attendees'])
                      ->findOrFail($id);
    
        return new EventResource($event);
    }

    /**
     * GET /events/my
     * Only event managers
     */
    public function showAllOfMyEvents()
    {
        $user = Auth::user();
        if ($user->role !== 'event_manager') {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $events = $user
            ->managedEvents()
            ->with(['venue', 'author', 'seats', 'attendees'])
            ->get();

        return EventResource::collection($events);
    }

    /**
     * POST /events
     * Only event managers
     */
    public function store(Request $request)
    {
        $user = Auth::user();
        if ($user->role !== 'event_manager') {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $data = $request->validate([
            'title'            => 'required|string|max:500',
            'description'      => 'required|string',
            'starts_at'        => 'required|date',
            'ends_at'          => 'required|date|after:starts_at',
            'venue_id'         => 'required|exists:venues,id',
            'author_id'        => 'required|exists:authors,id',
            'image_url'        => 'nullable|url',
            'tickets_capacity' => 'required|integer|min:0',
        ]);

        $data['manager_id']       = $user->id;
        $data['tickets_reserved'] = 0;

        $event = Event::create($data);
        $event->load(['venue', 'manager', 'author', 'seats', 'attendees']);

        return new EventResource($event);
    }

    /**
     * PUT /events/{id}
     * Only event managers on their own events
     */
    public function update(Request $request, $id)
    {
        $user = Auth::user();

        // Manually resolve or 404
        $event = Event::findOrFail($id);

        // Authorization check
        if ($user->role !== 'event_manager' || $event->manager_id !== $user->id) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        // Validate only the fields that may appear
        $data = $request->validate([
            'title'            => 'sometimes|string|max:500',
            'description'      => 'sometimes|string',
            'starts_at'        => 'sometimes|date',
            'ends_at'          => 'sometimes|date|after:starts_at',
            'venue_id'         => 'sometimes|exists:venues,id',
            'author_id'        => 'sometimes|exists:authors,id',
            'image_url'        => 'nullable|url',
            'tickets_capacity' => 'sometimes|integer|min:0',
        ]);

        // Apply update and reload relationships
        $event->update($data);
        $event->load(['venue', 'manager', 'author', 'seats', 'attendees']);

        return new EventResource($event);
    }

    /**
     * DELETE /events/{id}
     * Only event managers on their own events
     */
    public function delete(Request $request, $id)
    {
        $user = Auth::user();
    
        // Manually resolve or 404
        $event = Event::findOrFail($id);
    
        // Authorization check
        if ($user->role !== 'event_manager' || $event->manager_id !== $user->id) {
            return response()->json(['message' => 'Forbidden'], 403);
        }
    
        // Delete and return a success message
        $event->delete();
    
        return response()->json([
            'message' => 'Event deleted successfully!'
        ], 200);
    }
}
