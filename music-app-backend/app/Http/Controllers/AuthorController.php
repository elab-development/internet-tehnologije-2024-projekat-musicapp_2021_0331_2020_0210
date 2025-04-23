<?php
// app/Http/Controllers/AuthorController.php

namespace App\Http\Controllers;

use App\Http\Resources\AuthorResource;
use App\Models\Author;

class AuthorController extends Controller
{
    /**
     * GET /authors
     * Public: list all authors.
     */
    public function index()
    {
        return AuthorResource::collection(Author::all());
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
