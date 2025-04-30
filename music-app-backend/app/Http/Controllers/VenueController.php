<?php
// Kontroler za upravljanje lokacijama događaja (venues)

namespace App\Http\Controllers;

use App\Http\Resources\VenueResource;
use App\Models\Venue;
use Illuminate\Support\Facades\Log;

class VenueController extends Controller
{
    /**
     * GET /venues
     * Javno: vraća listu svih lokacija.
     */
    public function index()
    {
        // Učitavamo sve lokacije iz baze
        $venues = Venue::all();

        // Vraćamo ih kroz kolekciju VenueResource
        return VenueResource::collection($venues);
    }

    /**
     * GET /venues/{id}
     * Javno: vraća detalje jedne lokacije po ID-u.
     */
    public function show($id)
    {
        // Pronađemo lokaciju ili baci 404 grešku
        $venue = Venue::findOrFail($id);

        // Vraćamo je kao VenueResource
        return new VenueResource($venue);
    }
}
