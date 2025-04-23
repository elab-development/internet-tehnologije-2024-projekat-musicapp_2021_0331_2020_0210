<?php

namespace App\Http\Controllers;

use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    /**
     * Return a collection of all buyer users.
     * Only administrators may call this.
     */
    public function index()
    {
        $user = Auth::user();
        if ($user->role !== 'administrator') {
            return response()->json([
                'message' => 'Forbidden: administrators only.'
            ], 403);
        }

        $buyers = User::where('role', 'buyer')->get();

        return UserResource::collection($buyers);
    }
}
