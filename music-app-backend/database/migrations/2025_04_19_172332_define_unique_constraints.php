<?php
// database/migrations/2025_04_19_000005_add_unique_constraints.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddUniqueConstraints extends Migration
{
    public function up()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->unique('email');
        });

        Schema::table('venues', function (Blueprint $table) {
            $table->unique(['name', 'city', 'address']);
        });

        Schema::table('authors', function (Blueprint $table) {
            $table->unique('name');
        });

        Schema::table('seats', function (Blueprint $table) {
            // ensure you can’t define the same seat position twice in one event
            $table->unique(['event_id', 'position']);
        });
    }

    public function down()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropUnique(['users_email_unique']);
        });

        Schema::table('venues', function (Blueprint $table) {
            $table->dropUnique(['venues_name_city_address_unique']);
        });

        Schema::table('authors', function (Blueprint $table) {
            $table->dropUnique(['authors_name_unique']);
        });

        Schema::table('seats', function (Blueprint $table) {
            $table->dropUnique(['seats_event_id_position_unique']);
        });
    }
}
