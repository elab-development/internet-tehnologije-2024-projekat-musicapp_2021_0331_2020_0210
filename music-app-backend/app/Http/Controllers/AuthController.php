<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    /**
     * Register a new user and return a token + user info.
     */
    public function register(Request $request)
    {
        $validated = $request->validate([
            'name'       => 'required|string|max:255',
            'email'      => 'required|string|email|unique:users,email',
            'password'   => 'required|string|min:8|confirmed',
            'role'       => 'required|in:event_manager,buyer,administrator',
            'address'    => 'nullable|string|max:500',
            'phone'      => 'nullable|string|max:50',
            'image_url'  => 'nullable|url',
        ]);

        $user = User::create([
            'name'      => $validated['name'],
            'email'     => $validated['email'],
            'password'  => Hash::make($validated['password']),
            'role'      => $validated['role'],
            'address'   => $validated['address']  ?? null,
            'phone'     => $validated['phone']    ?? null,
            'image_url' => $validated['image_url']?? null,
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        $message = $this->getRoleSpecificMessage($user->role, 'registered');

        return response()->json([
            'message'      => $message,
            'id'           => $user->id,
            'name'         => $user->name,
            'email'        => $user->email,
            'role'         => $user->role,
            'token'        => $token,
        ], 201);
    }

    /**
     * Log in an existing user and return a token + user info.
     */
    public function login(Request $request)
    {
        $validated = $request->validate([
            'email'    => 'required|string|email',
            'password' => 'required|string',
        ]);

        if (! Auth::attempt(['email' => $validated['email'], 'password' => $validated['password']])) {
            return response()->json(['error' => 'Invalid login credentials! ⚠️'], 401);
        }

        $user = Auth::user();
        $token = $user->createToken('auth_token')->plainTextToken;

        $message = $this->getRoleSpecificMessage($user->role, 'logged in');

        return response()->json([
            'message'      => $message,
            'id'           => $user->id,
            'name'         => $user->name,
            'email'        => $user->email,
            'role'         => $user->role,
            'imageUrl'    => $user->image_url,
            'token'        => $token,
        ]);
    }

    /**
     * Log out the user (revoke all tokens).
     */
    public function logout(Request $request)
    {
        $user = $request->user();
        $user->tokens()->delete();

        $message = $this->getRoleSpecificMessage($user->role, 'logged out');

        return response()->json(['message' => $message]);
    }

    /**
     * Get role-specific messages.
     */
    private function getRoleSpecificMessage(string $role, string $action): string
    {
        $roleMessages = [
            'buyer' => [
                'registered' => 'Welcome, valued buyer! Your account has been successfully created. 🎉',
                'logged in'  => 'Hello, buyer! You are now logged in. 🛒',
                'logged out' => 'Goodbye, buyer! See you again soon! 👋',
            ],
            'event_manager' => [
                'registered' => 'Welcome, manager! You can now create and manage events. 🎫',
                'logged in'  => 'Hello, manager! Ready to oversee your events? 🏟️',
                'logged out' => 'Goodbye, manager! Your events are safe with us. 👋',
            ],
            'administrator' => [
                'registered' => 'Welcome, administrator! You now have access to manage the platform. 🛠️',
                'logged in'  => 'Hello, administrator! Ready to oversee the platform? 🔧',
                'logged out' => 'Goodbye, administrator! Take care. 👋',
            ],
        ];

        return $roleMessages[$role][$action] ?? 'Action completed successfully.';
    }
}
