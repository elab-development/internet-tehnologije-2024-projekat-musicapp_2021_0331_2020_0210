<?php
// app/Http/Controllers/AuthorController.php

namespace App\Http\Controllers;

use App\Http\Resources\AuthorResource;
use App\Models\Author;
use Illuminate\Support\Facades\Log;

class AuthorController extends Controller
{
    /**
     * GET /authors
     * Public: list all authors.
     */
    public function index()
    {
        $authors = Author::all();
        
        // Add debugging
        Log::info('Authors retrieved', ['count' => $authors->count()]);
        
        return AuthorResource::collection($authors);
    }

    /**
     * GET /authors/{id}
     * Public: show a single author by id.
     */
    public function show($id)
    {
        $author = Author::findOrFail($id);
        return new AuthorResource($author);
    }
}
