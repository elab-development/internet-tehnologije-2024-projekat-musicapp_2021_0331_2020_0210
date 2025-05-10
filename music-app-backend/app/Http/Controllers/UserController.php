<?php

namespace App\Http\Controllers;

use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    /**
     * Vraća kolekciju svih korisnika sa ulogom buyer.
     * Samo administrator može da pozove ovu metodu.
     */
    public function index()
    {
        // Uzimamo trenutno ulogovanog korisnika
        $user = Auth::user();

        // Proveravamo da li je korisnik administrator
        if ($user->role !== 'administrator') {
            // Ako nije, vraćamo 403 Forbidden
            return response()->json([
                'message' => 'Forbidden: administrators only.'
            ], 403);
        }

        // Dohvatamo sve korisnike čija je uloga 'buyer'
        $buyers = User::where('role', 'buyer')->get();

        // Vraćamo podatke kroz kolekciju UserResource
        return UserResource::collection($buyers);
    }
}
