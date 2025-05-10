<?php
// Kontroler za autore – omogućava listanje i pregled pojedinačnih autora

namespace App\Http\Controllers;

use App\Http\Resources\AuthorResource;
use App\Models\Author;

class AuthorController extends Controller
{
    /**
     * GET /authors
     * Javni endpoint za listanje svih autora.
     */
    public function index()
    {
        // Učitavamo sve autore iz baze
        $authors = Author::all();
        
        // Vraćamo kolekciju resursa
        return AuthorResource::collection($authors);
    }

    /**
     * GET /authors/{id}
     * Javni endpoint za prikaz jednog autora po ID-u.
     */
    public function show($id)
    {
        // Pokušavamo da pronađemo autora ili bacamo 404
        $author = Author::findOrFail($id);
        // Vraćamo resurs za pronađenog autora
        return new AuthorResource($author);
    }
}
