<?php
// database/migrations/2025_04_19_171946_add_foreign_keys_within_tables.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddForeignKeysWithinTables extends Migration
{
    public function up()
    {
        Schema::table('events', function (Blueprint $table) {
            $table->foreign('venue_id')
                  ->references('id')->on('venues')
                  ->cascadeOnDelete();

            $table->foreign('manager_id')
                  ->references('id')->on('users')
                  ->cascadeOnDelete();

            $table->foreign('author_id')
                  ->references('id')->on('authors')
                  ->cascadeOnDelete();
        });

        Schema::table('seats', function (Blueprint $table) {
            $table->foreign('event_id')
                  ->references('id')->on('events')
                  ->cascadeOnDelete();
        });

        Schema::table('reservations', function (Blueprint $table) {
            $table->foreign('user_id')
                  ->references('id')->on('users')
                  ->cascadeOnDelete();

            $table->foreign('event_id')
                  ->references('id')->on('events')
                  ->cascadeOnDelete();
        });

        Schema::table('reservation_seat', function (Blueprint $table) {
            $table->foreign('reservation_id')
                  ->references('id')->on('reservations')
                  ->cascadeOnDelete();

            $table->foreign('seat_id')
                  ->references('id')->on('seats')
                  ->cascadeOnDelete();
        });
    }

    public function down()
    {
        Schema::table('reservation_seat', function (Blueprint $table) {
            $table->dropForeign(['reservation_id']);
            $table->dropForeign(['seat_id']);
        });

        Schema::table('reservations', function (Blueprint $table) {
            $table->dropForeign(['user_id']);
            $table->dropForeign(['event_id']);
        });

        Schema::table('seats', function (Blueprint $table) {
            $table->dropForeign(['event_id']);
        });

        Schema::table('events', function (Blueprint $table) {
            $table->dropForeign(['venue_id']);
            $table->dropForeign(['manager_id']);
            $table->dropForeign(['author_id']);
        });
    }
}
