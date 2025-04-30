<?php
// app/Http/Controllers/VenueController.php

namespace App\Http\Controllers;

use App\Http\Resources\VenueResource;
use App\Models\Venue;
use Illuminate\Support\Facades\Log;

class VenueController extends Controller
{
    /**
     * GET /venues
     * Public: list all venues.
     */
    public function index()
    {
        $venues = Venue::all();
        
        // Add debugging
        Log::info('Venues retrieved', ['count' => $venues->count()]);
        
        return VenueResource::collection($venues);
    }

    /**
     * GET /venues/{id}
     * Public: show a single venue by id.
     */
    public function show($id)
    {
        $venue = Venue::findOrFail($id);
        return new VenueResource($venue);
    }
}
