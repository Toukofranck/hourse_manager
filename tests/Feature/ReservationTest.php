<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Property;
use App\Models\Reservation;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ReservationTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_create_reservation()
    {
        $user = User::factory()->create();
        $property = Property::factory()->create(['guests' => 4, 'price_per_night' => 100]);

        $response = $this->actingAs($user)->postJson('/api/reservations', [
            'property_id' => $property->id,
            'check_in_date' => now()->addDays(5)->format('Y-m-d'),
            'check_out_date' => now()->addDays(8)->format('Y-m-d'),
            'number_of_guests' => 2,
        ]);

        $response->assertStatus(201);
        $response->assertJsonPath('reservation.status', 'confirmed');
        $this->assertDatabaseHas('reservations', [
            'property_id' => $property->id,
            'user_id' => $user->id,
        ]);
    }

    public function test_cannot_create_reservation_with_too_many_guests()
    {
        $user = User::factory()->create();
        $property = Property::factory()->create(['guests' => 2, 'price_per_night' => 100]);

        $response = $this->actingAs($user)->postJson('/api/reservations', [
            'property_id' => $property->id,
            'check_in_date' => now()->addDays(5)->format('Y-m-d'),
            'check_out_date' => now()->addDays(8)->format('Y-m-d'),
            'number_of_guests' => 5,
        ]);

        $response->assertStatus(422);
    }

    public function test_cannot_create_overlapping_reservation()
    {
        $user = User::factory()->create();
        $property = Property::factory()->create(['guests' => 4, 'price_per_night' => 100]);

        // First reservation
        Reservation::create([
            'user_id' => $user->id,
            'property_id' => $property->id,
            'check_in_date' => now()->addDays(5),
            'check_out_date' => now()->addDays(8),
            'number_of_guests' => 2,
            'price_per_night' => 100,
            'number_of_nights' => 3,
            'total_price' => 300,
            'status' => 'confirmed',
        ]);

        // Try overlapping reservation
        $response = $this->actingAs($user)->postJson('/api/reservations', [
            'property_id' => $property->id,
            'check_in_date' => now()->addDays(6)->format('Y-m-d'),
            'check_out_date' => now()->addDays(9)->format('Y-m-d'),
            'number_of_guests' => 2,
        ]);

        $response->assertStatus(422);
    }

    public function test_user_can_view_their_reservations()
    {
        $user = User::factory()->create();
        $property = Property::factory()->create(['price_per_night' => 100]);

        Reservation::create([
            'user_id' => $user->id,
            'property_id' => $property->id,
            'check_in_date' => now()->addDays(5),
            'check_out_date' => now()->addDays(8),
            'number_of_guests' => 2,
            'price_per_night' => 100,
            'number_of_nights' => 3,
            'total_price' => 300,
            'status' => 'confirmed',
        ]);

        $response = $this->actingAs($user)->getJson('/api/reservations');

        $response->assertStatus(200);
        $this->assertCount(1, $response['data']);
        $response->assertJsonPath('data.0.status', 'confirmed');
    }
}
