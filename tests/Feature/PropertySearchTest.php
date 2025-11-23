<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Property;
use App\Models\Reservation;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PropertySearchTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_list_all_properties()
    {
        $user = User::factory()->create();
        Property::factory(3)->create(['user_id' => $user->id]);

        $response = $this->getJson('/api/properties');

        $response->assertStatus(200);
        $response->assertJsonStructure(['data', 'current_page', 'total']);
        $this->assertCount(3, $response['data']);
    }

    public function test_can_search_properties_by_city()
    {
        $user = User::factory()->create();
        Property::factory()->create(['user_id' => $user->id, 'city' => 'Paris']);
        Property::factory()->create(['user_id' => $user->id, 'city' => 'Lyon']);

        $response = $this->getJson('/api/properties?city=Paris');

        $response->assertStatus(200);
        $this->assertCount(1, $response['data']);
        $this->assertEquals('Paris', $response['data'][0]['city']);
    }

    public function test_can_filter_by_price_range()
    {
        $user = User::factory()->create();
        Property::factory()->create(['user_id' => $user->id, 'price_per_night' => 50]);
        Property::factory()->create(['user_id' => $user->id, 'price_per_night' => 150]);
        Property::factory()->create(['user_id' => $user->id, 'price_per_night' => 300]);

        $response = $this->getJson('/api/properties?min_price=100&max_price=250');

        $response->assertStatus(200);
        $this->assertCount(1, $response['data']);
        $this->assertEquals(150, $response['data'][0]['price_per_night']);
    }

    public function test_can_sort_by_rating()
    {
        $user = User::factory()->create();
        Property::factory()->create(['user_id' => $user->id, 'rating' => 3.5]);
        Property::factory()->create(['user_id' => $user->id, 'rating' => 4.8]);
        Property::factory()->create(['user_id' => $user->id, 'rating' => 4.2]);

        $response = $this->getJson('/api/properties?sort_by=rating');

        $response->assertStatus(200);
        $this->assertEquals(4.8, $response['data'][0]['rating']);
        $this->assertEquals(4.2, $response['data'][1]['rating']);
    }

    public function test_can_get_single_property()
    {
        $user = User::factory()->create();
        $property = Property::factory()->create(['user_id' => $user->id]);

        $response = $this->getJson("/api/properties/{$property->id}");

        $response->assertStatus(200);
        $response->assertJsonPath('title', $property->title);
        $response->assertJsonPath('city', $property->city);
    }
}
