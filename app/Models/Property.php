<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Property extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'title',
        'description',
        'city',
        'country',
        'postal_code',
        'address',
        'latitude',
        'longitude',
        'price_per_night',
        'bedrooms',
        'bathrooms',
        'guests',
        'amenities',
        'property_type',
        'image_url',
        'images',
        'rating',
        'reviews_count',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'latitude' => 'float',
        'longitude' => 'float',
        'price_per_night' => 'float',
        'rating' => 'float',
    ];

    /**
     * Relationship: A property belongs to a user
     */
    public function owner()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * Relationship: A property can have many reservations
     */
    public function reservations()
    {
        return $this->hasMany(Reservation::class);
    }

    /**
     * Relationship: A property can have many reviews
     */
    public function reviews()
    {
        return $this->hasMany(Review::class);
    }

    /**
     * Relationship: A property can have many amenities
     */
    public function amenities()
    {
        return $this->belongsToMany(Amenity::class, 'property_amenities');
    }

    /**
     * Scope: Get only active properties
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope: Filter by location
     */
    public function scopeByLocation($query, $city, $country = null)
    {
        $query->where('city', 'like', "%{$city}%");
        if ($country) {
            $query->where('country', 'like', "%{$country}%");
        }
        return $query;
    }

    /**
     * Scope: Filter by price range
     */
    public function scopeByPriceRange($query, $minPrice, $maxPrice)
    {
        return $query->whereBetween('price_per_night', [$minPrice, $maxPrice]);
    }

    /**
     * Scope: Filter by property type
     */
    public function scopeByPropertyType($query, $type)
    {
        return $query->where('property_type', $type);
    }

    /**
     * Scope: Filter by number of bedrooms
     */
    public function scopeByBedrooms($query, $bedrooms)
    {
        return $query->where('bedrooms', '>=', $bedrooms);
    }

    /**
     * Scope: Filter by number of guests
     */
    public function scopeByGuests($query, $guests)
    {
        return $query->where('guests', '>=', $guests);
    }

    /**
     * Scope: Sort by rating
     */
    public function scopeSortByRating($query)
    {
        return $query->orderBy('rating', 'desc');
    }

    /**
     * Scope: Sort by price (ascending)
     */
    public function scopeSortByPriceAsc($query)
    {
        return $query->orderBy('price_per_night', 'asc');
    }

    /**
     * Scope: Sort by price (descending)
     */
    public function scopeSortByPriceDesc($query)
    {
        return $query->orderBy('price_per_night', 'desc');
    }

    /**
     * Scope: Sort by newest
     */
    public function scopeSortByNewest($query)
    {
        return $query->orderBy('created_at', 'desc');
    }

    /**
     * Scope: Filter by availability
     */
    public function scopeByAvailability($query, $checkInDate, $checkOutDate)
    {
        return $query->whereNotIn('id', function ($subquery) use ($checkInDate, $checkOutDate) {
            $subquery->select('property_id')
                ->from('reservations')
                ->where('status', '!=', 'cancelled')
                ->where(function ($query) use ($checkInDate, $checkOutDate) {
                    $query->whereBetween('check_in_date', [$checkInDate, $checkOutDate])
                        ->orWhereBetween('check_out_date', [$checkInDate, $checkOutDate])
                        ->orWhere(function ($q) use ($checkInDate, $checkOutDate) {
                            $q->where('check_in_date', '<=', $checkInDate)
                                ->where('check_out_date', '>=', $checkOutDate);
                        });
                });
        });
    }

    /**
     * Get search results
     */
    public static function search($params = [])
    {
        $query = self::active();

        if (isset($params['city'])) {
            $query->byLocation($params['city'], $params['country'] ?? null);
        }

        if (isset($params['min_price']) && isset($params['max_price'])) {
            $query->byPriceRange($params['min_price'], $params['max_price']);
        }

        if (isset($params['property_type'])) {
            $query->byPropertyType($params['property_type']);
        }

        if (isset($params['bedrooms'])) {
            $query->byBedrooms($params['bedrooms']);
        }

        if (isset($params['guests'])) {
            $query->byGuests($params['guests']);
        }

        if (isset($params['check_in_date']) && isset($params['check_out_date'])) {
            $query->byAvailability($params['check_in_date'], $params['check_out_date']);
        }

        // Sorting
        if (isset($params['sort_by'])) {
            switch ($params['sort_by']) {
                case 'rating':
                    $query->sortByRating();
                    break;
                case 'price_asc':
                    $query->sortByPriceAsc();
                    break;
                case 'price_desc':
                    $query->sortByPriceDesc();
                    break;
                case 'newest':
                    $query->sortByNewest();
                    break;
            }
        }

        return $query;
    }
}
