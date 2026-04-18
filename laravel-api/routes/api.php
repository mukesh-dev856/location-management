<?php

use App\Http\Controllers\Api\LocationController;
use Illuminate\Support\Facades\Route;

Route::get('/active-states', [LocationController::class, 'index']);
