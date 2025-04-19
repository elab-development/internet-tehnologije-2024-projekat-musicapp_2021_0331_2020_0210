<?php
// database/migrations/2025_04_19_000004_modify_users_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class ModifyUsersTable extends Migration
{
    public function up()
    {
        Schema::table('users', function (Blueprint $table) {
            // remove Laravel's built‑in email_verified_at
            $table->dropColumn('email_verified_at');

            // add your app‑specific fields
            $table->enum('role', ['event_manager', 'buyer', 'administrator'])
                  ->default('buyer')
                  ->after('password');
            $table->string('address', 100)->after('role');
            $table->string('phone', 100)->after('address');
            $table->string('image_url', 100)->nullable()->after('phone');
        });
    }

    public function down()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->timestamp('email_verified_at')->nullable()->after('email');
            $table->dropColumn(['role', 'address', 'phone', 'image_url']);
        });
    }
}
