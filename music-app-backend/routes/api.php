<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\AuthorController;
use App\Http\Controllers\VenueController;
use App\Http\Controllers\SeatController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\ReservationController;

/*
|--------------------------------------------------------------------------
| Public routes
|--------------------------------------------------------------------------
*/

// Authentication
Route::post('register', [AuthController::class, 'register']);
Route::post('login',    [AuthController::class, 'login']);

// Authors & Venues (public)
Route::get('authors',       [AuthorController::class, 'index']);
Route::get('authors/{id}',  [AuthorController::class, 'show']);
Route::get('venues',        [VenueController::class, 'index']);
Route::get('venues/{id}',   [VenueController::class, 'show']);

// Seats as an API resource (only index & show)
Route::apiResource('seats', SeatController::class)
     ->only(['index', 'show']);

/*
|--------------------------------------------------------------------------
| Protected routes (sanctum)
|--------------------------------------------------------------------------
*/
Route::middleware('auth:sanctum')->group(function () {

    // Logout
    Route::post('logout', [AuthController::class, 'logout']);

    // Buyers list (admin only)
    Route::get('buyers', [UserController::class, 'index']);

    // Events
    Route::get('events',          [EventController::class, 'index']);
    Route::get('events/my',       [EventController::class, 'showAllOfMyEvents']);    
    Route::get('events/{id}',     [EventController::class, 'show']);
    Route::post('events',         [EventController::class, 'store']);
    Route::put('events/{id}', [EventController::class, 'update']);
    Route::delete('events/{id}',  [EventController::class, 'delete']);
    Route::post('events/{id}/seats', [SeatController::class, 'createForEvent']);

    // Reservations
    Route::get('reservations/events',       [ReservationController::class, 'showAllOfOrdersForMyEvents']);
    Route::get('reservations/my',           [ReservationController::class, 'showAllOfMyOrders']);
    Route::post('reservations',             [ReservationController::class, 'store']);
    Route::patch('reservations/{id}/status',[ReservationController::class, 'updateStatus']);
    Route::delete('reservations/{id}',      [ReservationController::class, 'delete']);
});
