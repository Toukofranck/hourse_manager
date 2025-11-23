<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Property;
use App\Models\Reservation;
use App\Models\Review;
use App\Models\Amenity;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create amenities
        $amenities = [
            ['name' => 'WiFi', 'icon' => 'wifi'],
            ['name' => 'Kitchen', 'icon' => 'utensils'],
            ['name' => 'Air Conditioning', 'icon' => 'wind'],
            ['name' => 'Heating', 'icon' => 'fire'],
            ['name' => 'TV', 'icon' => 'tv'],
            ['name' => 'Parking', 'icon' => 'car'],
            ['name' => 'Swimming Pool', 'icon' => 'swimming-pool'],
            ['name' => 'Gym', 'icon' => 'dumbbell'],
            ['name' => 'Washer', 'icon' => 'washer'],
            ['name' => 'Dryer', 'icon' => 'dryer'],
            ['name' => 'Balcony', 'icon' => 'balcony'],
            ['name' => 'Garden', 'icon' => 'leaf'],
        ];

        foreach ($amenities as $amenity) {
            Amenity::firstOrCreate(['name' => $amenity['name']], $amenity);
        }

        // Create test users
        $user1 = User::firstOrCreate([
            'email' => 'owner1@example.com'
        ], [
            'name' => 'Marie Dupont',
            'password' => bcrypt('password'),
            'email_verified_at' => now(),
        ]);

        $user2 = User::firstOrCreate([
            'email' => 'owner2@example.com'
        ], [
            'name' => 'Jean Martin',
            'password' => bcrypt('password'),
            'email_verified_at' => now(),
        ]);

        $guest = User::firstOrCreate([
            'email' => 'guest@example.com'
        ], [
            'name' => 'Alice Johnson',
            'password' => bcrypt('password'),
            'email_verified_at' => now(),
        ]);

        // Create test properties
        $properties = [
            [
                'title' => 'Luxurious Apartment in Paris',
                'description' => 'Beautiful 2-bedroom apartment in the heart of Paris with stunning Eiffel Tower views.',
                'city' => 'Paris',
                'country' => 'France',
                'address' => '42 Rue de la Paix, 75000',
                'price_per_night' => 150,
                'bedrooms' => 2,
                'bathrooms' => 1,
                'guests' => 4,
                'property_type' => 'apartment',
                'image_url' => 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267',
                'user_id' => $user1->id,
                'latitude' => 48.8566,
                'longitude' => 2.3522,
            ],
            [
                'title' => 'Modern Villa in Provence',
                'description' => 'Stunning villa with private pool, garden, and countryside views in the Provence region.',
                'city' => 'Avignon',
                'country' => 'France',
                'address' => '123 Chemin de la Bastide',
                'price_per_night' => 250,
                'bedrooms' => 3,
                'bathrooms' => 2,
                'guests' => 6,
                'property_type' => 'villa',
                'image_url' => 'https://images.unsplash.com/photo-1562891304-c86f91a22d5f',
                'user_id' => $user1->id,
                'latitude' => 43.9493,
                'longitude' => 4.8055,
            ],
            [
                'title' => 'Cozy Studio in Lyon',
                'description' => 'Perfect for solo travelers or couples. Located near major attractions.',
                'city' => 'Lyon',
                'country' => 'France',
                'address' => '78 Rue Saint-Jean',
                'price_per_night' => 80,
                'bedrooms' => 1,
                'bathrooms' => 1,
                'guests' => 2,
                'property_type' => 'studio',
                'image_url' => 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688',
                'user_id' => $user2->id,
                'latitude' => 45.7640,
                'longitude' => 4.8357,
            ],
            [
                'title' => 'Charming House in Montmartre',
                'description' => 'Charming 2-bedroom house in the historic Montmartre district.',
                'city' => 'Paris',
                'country' => 'France',
                'address' => '9 Rue Lepic, 75018',
                'price_per_night' => 120,
                'bedrooms' => 2,
                'bathrooms' => 1,
                'guests' => 4,
                'property_type' => 'house',
                'image_url' => 'https://images.unsplash.com/photo-1570129477492-45a003537e1f',
                'user_id' => $user2->id,
                'latitude' => 48.8867,
                'longitude' => 2.3431,
            ],
            [
                'title' => 'Beachfront Cottage in Nice',
                'description' => 'Beautiful cottage right on the beach with sea views.',
                'city' => 'Nice',
                'country' => 'France',
                'address' => '25 Promenade des Anglais',
                'price_per_night' => 180,
                'bedrooms' => 3,
                'bathrooms' => 2,
                'guests' => 6,
                'property_type' => 'cottage',
                'image_url' => 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6',
                'user_id' => $user1->id,
                'latitude' => 43.7102,
                'longitude' => 7.2620,
            ],
        ];

        foreach ($properties as $propertyData) {
            $property = Property::firstOrCreate(
                ['title' => $propertyData['title']],
                $propertyData
            );

            // Assign random amenities
            $amenityIds = Amenity::inRandomOrder()->limit(rand(3, 6))->pluck('id')->toArray();
            $property->amenities()->sync($amenityIds);
        }

        // Create test reservations
        $properties = Property::all();
        $reservations = [
            [
                'user_id' => $guest->id,
                'property_id' => $properties->first()->id,
                'check_in_date' => Carbon::now()->addDays(5),
                'check_out_date' => Carbon::now()->addDays(8),
                'number_of_guests' => 2,
                'status' => 'confirmed',
            ],
            [
                'user_id' => $guest->id,
                'property_id' => $properties->get(1)->id,
                'check_in_date' => Carbon::now()->subDays(10),
                'check_out_date' => Carbon::now()->subDays(7),
                'number_of_guests' => 4,
                'status' => 'completed',
            ],
        ];

        foreach ($reservations as $resData) {
            $property = Property::find($resData['property_id']);
            $checkIn = $resData['check_in_date'];
            $checkOut = $resData['check_out_date'];
            $nights = $checkIn->diffInDays($checkOut);

            Reservation::create([
                ...$resData,
                'price_per_night' => $property->price_per_night,
                'number_of_nights' => $nights,
                'total_price' => $nights * $property->price_per_night,
            ]);
        }

        // Create test reviews
        $completedReservations = Reservation::where('status', 'completed')->get();
        foreach ($completedReservations as $reservation) {
            Review::create([
                'reservation_id' => $reservation->id,
                'user_id' => $reservation->user_id,
                'property_id' => $reservation->property_id,
                'rating' => rand(4, 5),
                'comment' => 'Wonderful place! Great location and very comfortable. Highly recommended!',
            ]);
        }

        // Update property ratings
        $properties = Property::all();
        foreach ($properties as $property) {
            $reviews = Review::where('property_id', $property->id)->get();
            if ($reviews->count() > 0) {
                $property->update([
                    'rating' => $reviews->avg('rating'),
                    'reviews_count' => $reviews->count(),
                ]);
            }
        }
    }
}
