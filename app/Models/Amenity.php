<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Amenity extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'icon',
        'description',
    ];

    /**
     * Relationship: An amenity belongs to many properties
     */
    public function properties()
    {
        return $this->belongsToMany(Property::class, 'property_amenities');
    }
}
