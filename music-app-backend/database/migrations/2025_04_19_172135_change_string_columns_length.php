<?php
// database/migrations/2025_04_19_000003_change_string_column_length.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class ChangeStringColumnsLength extends Migration
{
    public function up()
    {
        // Users
        Schema::table('users', function (Blueprint $table) {
            $table->string('name', 500)->change();
            $table->string('email', 500)->change();
            $table->string('password', 500)->change();
        });

        // Venues
        Schema::table('venues', function (Blueprint $table) {
            $table->string('name', 500)->change();
            $table->string('city', 500)->change();
            $table->string('country', 500)->change();
            $table->string('address', 500)->change();
            $table->string('image_url', 500)->change();
        });

        // Authors
        Schema::table('authors', function (Blueprint $table) {
            $table->string('name', 500)->change();
            $table->string('music_genre', 500)->change();
            $table->string('image_url', 500)->change();
        });

        // Events
        Schema::table('events', function (Blueprint $table) {
            $table->string('title', 500)->change();
            $table->string('image_url', 500)->change();
        });

        // Seats
        Schema::table('seats', function (Blueprint $table) {
            $table->string('position', 500)->change();
        });

        // Reservations
        Schema::table('reservations', function (Blueprint $table) {
            $table->string('status', 500)->change();
        });
    }

    public function down()
    {
        // revert back to 100
        Schema::table('users', function (Blueprint $table) {
            $table->string('name', 100)->change();
            $table->string('email', 100)->change();
            $table->string('password', 100)->change();
        });
        Schema::table('venues', function (Blueprint $table) {
            $table->string('name', 100)->change();
            $table->string('city', 100)->change();
            $table->string('country', 100)->change();
            $table->string('address', 100)->change();
            $table->string('image_url', 100)->change();
        });
        Schema::table('authors', function (Blueprint $table) {
            $table->string('name', 100)->change();
            $table->string('music_genre', 100)->change();
            $table->string('image_url', 100)->change();
        });
        Schema::table('events', function (Blueprint $table) {
            $table->string('title', 100)->change();
            $table->string('image_url', 100)->change();
        });
        Schema::table('seats', function (Blueprint $table) {
            $table->string('position', 100)->change();
        });
        Schema::table('reservations', function (Blueprint $table) {
            $table->string('status', 100)->change();
        });
    }
}
