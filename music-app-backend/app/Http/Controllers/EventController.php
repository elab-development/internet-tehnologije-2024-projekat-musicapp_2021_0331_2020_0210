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
    // Prikazuje listu svih događaja za sve korisnike osim administratora
    public function index()
    {
        // Uzimamo trenutno prijavljenog korisnika
        $user = Auth::user();

        // Ako je korisnik administrator, vraćamo 403 Forbidden
        if ($user->role === 'administrator') {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        // Učitavamo sve događaje zajedno sa pripadajućim vezama (venue, manager, author)
        $events = Event::with(['venue', 'manager', 'author'])->get();

        // Vraćamo kolekciju EventResource resursa
        return EventResource::collection($events);
    }

    /**
     * GET /events/{event}
     * Everyone except administrators
     */
    // Prikazuje detalje jednog događaja za sve korisnike osim administratora
    public function show($id)
    {
        // Uzimamo trenutno prijavljenog korisnika
        $user = Auth::user();

        // Ako je korisnik administrator, vraćamo 403 Forbidden
        if ($user->role === 'administrator') {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        // Učitavamo događaj sa svim vezama: venue, manager, author, seats, attendees, reservations
        $event = Event::with([
            'venue',
            'manager',
            'author',
            'seats',
            'attendees',
            'seats.reservations'
        ])->findOrFail($id);

        // Vraćamo EventResource resurs
        return new EventResource($event);
    }

    /**
     * GET /events/my
     * Only event managers
     */
    // Prikazuje sve događaje kojima upravlja prijavljeni menadžer
    public function showAllOfMyEvents()
    {
        // Uzimamo trenutno prijavljenog korisnika
        $user = Auth::user();

        // Ako korisnik nije event_manager, vraćamo 403 Forbidden
        if ($user->role !== 'event_manager') {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        // Učitavamo događaje koje menadžer upravlja sa pripadajućim vezama
        $events = $user
            ->managedEvents()
            ->with(['venue', 'author', 'seats', 'attendees'])
            ->get();

        // Vraćamo kolekciju EventResource resursa
        return EventResource::collection($events);
    }

    /**
     * POST /events
     * Only event managers
     */
    // Kreira novi događaj (samo za menadžere)
    public function store(Request $request)
    {
        // Uzimamo trenutno prijavljenog korisnika
        $user = Auth::user();

        // Ako korisnik nije event_manager, vraćamo 403 Forbidden
        if ($user->role !== 'event_manager') {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        // Validacija ulaznih podataka
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

        // Povezujemo menadžera i inicijalizujemo reserved na 0
        $data['manager_id']       = $user->id;
        $data['tickets_reserved'] = 0;

        // Kreiramo događaj
        $event = Event::create($data);

        // Ponovo učitavamo veze
        $event->load(['venue', 'manager', 'author', 'seats', 'attendees']);

        // Vraćamo novi EventResource resurs
        return new EventResource($event);
    }

    /**
     * PUT /events/{id}
     * Only event managers on their own events
     */
    // Ažurira postojeći događaj (samo za njegovog menadžera)
    public function update(Request $request, $id)
    {
        // Uzimamo trenutno prijavljenog korisnika
        $user = Auth::user();

        // Pronalaženje događaja ili 404
        $event = Event::findOrFail($id);

        // Provera da li je menadžer i vlasnik događaja
        if ($user->role !== 'event_manager' || $event->manager_id !== $user->id) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        // Validacija samo polja koja su prosleđena
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

        // Ažuriramo događaj
        $event->update($data);

        // Ponovo učitavamo veze
        $event->load(['venue', 'manager', 'author', 'seats', 'attendees']);

        // Vraćamo ažurirani EventResource resurs
        return new EventResource($event);
    }

    /**
     * DELETE /events/{id}
     * Only event managers on their own events
     */
    // Briše događaj (samo menadžer koji ga je kreirao)
    public function delete(Request $request, $id)
    {
        // Uzimamo trenutno prijavljenog korisnika
        $user = Auth::user();

        // Pronalaženje događaja ili 404
        $event = Event::findOrFail($id);

        // Provera da li je menadžer i vlasnik događaja
        if ($user->role !== 'event_manager' || $event->manager_id !== $user->id) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        // Brišemo događaj
        $event->delete();

        // Vraćamo poruku o uspehu
        return response()->json([
            'message' => 'Event deleted successfully!'
        ], 200);
    }
}
