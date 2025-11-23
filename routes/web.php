<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

// Public routes
Route::get('/', function () {
    return Inertia::render('home');
})->name('home');

Route::get('/api-login', function () {
    return Inertia::render('api-login');
})->name('api-login');

Route::get('/api-register', function () {
    return Inertia::render('api-register');
})->name('api-register');

Route::get('/properties', function () {
    return Inertia::render('Properties');
})->name('properties.index');

Route::get('/properties/{id}', function ($id) {
    return Inertia::render('PropertyDetail', ['propertyId' => $id]);
})->name('properties.show');

// Protected dashboard routes (authentication required)
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard/Dashboard');
    })->name('dashboard');

    Route::get('dashboard/reservations', function () {
        return Inertia::render('dashboard/my-reservations');
    })->name('dashboard.reservations');

    Route::get('dashboard/properties', function () {
        return Inertia::render('dashboard/my-properties');
    })->name('dashboard.properties');

    Route::get('dashboard/properties-crud', function () {
        return Inertia::render('dashboard/properties-crud');
    })->name('dashboard.properties-crud');
});

require __DIR__ . '/settings.php';
