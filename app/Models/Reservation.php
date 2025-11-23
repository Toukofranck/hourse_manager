<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Reservation extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'property_id',
        'check_in_date',
        'check_out_date',
        'number_of_guests',
        'total_price',
        'price_per_night',
        'number_of_nights',
        'status',
        'notes',
        'cancellation_reason',
    ];

    protected $casts = [
        'check_in_date' => 'date',
        'check_out_date' => 'date',
        'total_price' => 'float',
        'price_per_night' => 'float',
    ];

    /**
     * Relationship: A reservation belongs to a user
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Relationship: A reservation belongs to a property
     */
    public function property()
    {
        return $this->belongsTo(Property::class);
    }

    /**
     * Relationship: A reservation can have a review
     */
    public function review()
    {
        return $this->hasOne(Review::class);
    }

    /**
     * Scope: Filter by status
     */
    public function scopeByStatus($query, $status)
    {
        return $query->where('status', $status);
    }

    /**
     * Scope: Get upcoming reservations
     */
    public function scopeUpcoming($query)
    {
        return $query->where('check_in_date', '>', now())
            ->where('status', '!=', 'cancelled');
    }

    /**
     * Scope: Get past reservations
     */
    public function scopePast($query)
    {
        return $query->where('check_out_date', '<', now());
    }

    /**
     * Check if a date range is available for a property
     */
    public static function isDateRangeAvailable($propertyId, $checkInDate, $checkOutDate)
    {
        return !self::where('property_id', $propertyId)
            ->where('status', '!=', 'cancelled')
            ->where(function ($query) use ($checkInDate, $checkOutDate) {
                $query->whereBetween('check_in_date', [$checkInDate, $checkOutDate])
                    ->orWhereBetween('check_out_date', [$checkInDate, $checkOutDate])
                    ->orWhere(function ($q) use ($checkInDate, $checkOutDate) {
                        $q->where('check_in_date', '<=', $checkInDate)
                            ->where('check_out_date', '>=', $checkOutDate);
                    });
            })
            ->exists();
    }
}
