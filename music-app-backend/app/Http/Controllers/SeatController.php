<?php
// app/Http/Controllers/SeatController.php

namespace App\Http\Controllers;

use App\Http\Resources\SeatResource;
use App\Models\Seat;

class SeatController extends Controller
{
    /**
     * GET /seats
     * Public: list all seats.
     */
    public function index()
    {
        return SeatResource::collection(Seat::all());
    }

    /**
     * GET /seats/{id}
     * Public: show a single seat by id.
     */
    public function show($id)
    {
        $seat = Seat::findOrFail($id);
        return new SeatResource($seat);
    }
}
