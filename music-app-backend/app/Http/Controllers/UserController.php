<?php

namespace App\Http\Controllers;

use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function __construct()
    {
        // Ensure only authenticated users can access these endpoints
        $this->middleware('auth:sanctum');
    }

    /**
     * Return a collection of all buyer users.
     * Only administrators may call this.
     */
    public function index(Request $request)
    {
        // Check that the authenticated user is an administrator
        if ($request->user()->role !== 'administrator') {
            return response()->json([
                'message' => 'Forbidden: administrators only.'
            ], 403);
        }

        // Fetch all users with the 'buyer' role
        $buyers = User::where('role', 'buyer')->get();

        // Return them as a resource collection
        return UserResource::collection($buyers);
    }
}
