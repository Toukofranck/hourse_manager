import React from 'react';
import { Link } from '@inertiajs/react';
import { Star, MapPin, Users, Bed, Bath, Heart, BookOpen } from 'lucide-react';

export default function PropertyCard({ property, isAuthenticated }) {
  return (
    <Link href={`/properties/${property.id}`}>
      <div className="bg-white rounded-lg shadow-lg hover:shadow-xl transition duration-300 overflow-hidden cursor-pointer h-full">
        {/* Image */}
        <div className="relative h-48 bg-gray-200 overflow-hidden">
          <img
            src={property.image_url || 'https://via.placeholder.com/400x300'}
            alt={property.title}
            className="w-full h-full object-cover hover:scale-105 transition duration-300"
          />
          {isAuthenticated && (
            <button className="absolute top-3 right-3 bg-white rounded-full p-2 hover:bg-gray-100 shadow">
              <Heart size={20} />
            </button>
          )}
          <div className="absolute bottom-0 right-0 bg-gradient-to-l from-black/80 to-transparent px-3 py-1">
            <span className="text-white font-semibold">€{property.price_per_night}/night</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Title */}
          <h3 className="font-bold text-lg mb-2 line-clamp-2 hover:text-blue-600">
            {property.title}
          </h3>

          {/* Location */}
          <div className="flex items-center gap-2 text-gray-600 mb-3 text-sm">
            <MapPin size={16} />
            <span>{property.city}, {property.country}</span>
          </div>

          {/* Quick Info */}
          <div className="grid grid-cols-3 gap-2 mb-3 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <Bed size={16} />
              <span>{property.bedrooms}</span>
            </div>
            <div className="flex items-center gap-1">
              <Bath size={16} />
              <span>{property.bathrooms}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users size={16} />
              <span>{property.guests}</span>
            </div>
          </div>

          {/* Description */}
          <p className="text-gray-600 text-sm line-clamp-2 mb-3">
            {property.description}
          </p>

          {/* Rating */}
          <div className="flex items-center justify-between pt-3 border-t">
            <div className="flex items-center gap-1">
              <Star className="text-yellow-400 fill-current" size={18} />
              <span className="font-semibold">{property.rating.toFixed(1)}</span>
              <span className="text-gray-500 text-sm">({property.reviews_count})</span>
            </div>
            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded capitalize">
              {property.property_type}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
