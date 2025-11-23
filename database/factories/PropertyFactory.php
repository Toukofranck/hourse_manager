<?php

namespace Database\Factories;

use App\Models\Property;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class PropertyFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Property::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $cities = ['Paris', 'Lyon', 'Marseille', 'Toulouse', 'Nice', 'Nantes', 'Strasbourg', 'Montpellier'];
        $propertyTypes = ['apartment', 'house', 'villa', 'cottage', 'studio', 'room'];

        return [
            'user_id' => User::factory(),
            'title' => $this->faker->words(3, true),
            'description' => $this->faker->paragraphs(2, true),
            'city' => $this->faker->randomElement($cities),
            'country' => 'France',
            'address' => $this->faker->streetAddress(),
            'postal_code' => $this->faker->postcode(),
            'latitude' => $this->faker->latitude(),
            'longitude' => $this->faker->longitude(),
            'price_per_night' => $this->faker->numberBetween(50, 500),
            'bedrooms' => $this->faker->numberBetween(1, 5),
            'bathrooms' => $this->faker->numberBetween(1, 3),
            'guests' => $this->faker->numberBetween(2, 8),
            'property_type' => $this->faker->randomElement($propertyTypes),
            'rating' => $this->faker->randomFloat(1, 0, 5),
            'reviews_count' => $this->faker->numberBetween(0, 50),
            'is_active' => true,
            'amenities' => json_encode(['WiFi', 'Pool', 'Kitchen', 'AC']),
        ];
    }
}
