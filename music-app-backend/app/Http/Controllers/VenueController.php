<?php
// app/Http/Controllers/VenueController.php

namespace App\Http\Controllers;

use App\Http\Resources\VenueResource;
use App\Models\Venue;

class VenueController extends Controller
{
    /**
     * GET /venues
     * Public: list all venues.
     */
    public function index()
    {
        return VenueResource::collection(Venue::all());
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
