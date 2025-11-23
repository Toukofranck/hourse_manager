<?php

namespace Database\Factories;

use App\Models\Reservation;
use App\Models\User;
use App\Models\Property;
use Illuminate\Database\Eloquent\Factories\Factory;

class ReservationFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Reservation::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $checkIn = $this->faker->dateTimeBetween('+1 day', '+30 days');
        $checkOut = $this->faker->dateTimeBetween($checkIn, '+60 days');

        return [
            'user_id' => User::factory(),
            'property_id' => Property::factory(),
            'check_in_date' => $checkIn,
            'check_out_date' => $checkOut,
            'guests' => $this->faker->numberBetween(1, 8),
            'total_price' => $this->faker->numberBetween(100, 2000),
            'status' => $this->faker->randomElement(['pending', 'confirmed', 'cancelled']),
        ];
    }
}
