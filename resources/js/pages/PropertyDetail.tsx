import React, { useState, useEffect } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { Star, MapPin, Users, Bed, Bath, Loader2, Heart, Share2 } from 'lucide-react';

export default function PropertyDetail({ propertyId }: { propertyId?: string }) {
  const id = propertyId || (typeof window !== 'undefined' ? window.location.pathname.split('/').pop() : null);
  const { auth } = usePage().props;
  const [property, setProperty] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id && id !== 'properties') {
      fetchProperty();
    }
  }, [id]);

  const fetchProperty = async () => {
    try {
      const response = await fetch(`/api/properties/${id}`);
      const data = await response.json();
      setProperty(data);
    } catch (error) {
      console.error('Error fetching property:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <Loader2 className="animate-spin h-12 w-12 text-primary-600" />
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Property Not Found</h1>
          <Link href="/properties" className="text-primary-600 hover:underline">Back to properties</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="relative h-96 bg-gray-200">
        <img src={property.image_url || 'https://via.placeholder.com/1200x400'} alt={property.title} className="w-full h-full object-cover" />
        <Link href="/properties" className="absolute top-4 left-4 bg-white text-gray-900 px-4 py-2 rounded-lg font-semibold">← Back</Link>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h1 className="text-4xl font-bold mb-4">{property.title}</h1>
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`h-5 w-5 ${i < Math.round(property.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                ))}
              </div>
              <span>{property.rating?.toFixed(1)} ({property.reviews_count} reviews)</span>
              <MapPin className="h-5 w-5" />
              <span>{property.city}, {property.country}</span>
            </div>

            <div className="grid grid-cols-4 gap-4 mb-8 bg-white p-6 rounded-lg border">
              <div className="text-center">
                <Users className="h-6 w-6 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Guests</p>
                <p className="font-semibold">{property.guests}</p>
              </div>
              <div className="text-center">
                <Bed className="h-6 w-6 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Beds</p>
                <p className="font-semibold">{property.bedrooms}</p>
              </div>
              <div className="text-center">
                <Bath className="h-6 w-6 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Baths</p>
                <p className="font-semibold">{property.bathrooms}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">Type</p>
                <p className="font-semibold capitalize">{property.property_type}</p>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">About</h2>
              <p className="text-gray-700">{property.description}</p>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-white p-6 rounded-lg border shadow-lg">
              <p className="text-gray-600 mb-2">Price per night</p>
              <p className="text-4xl font-bold text-primary-600 mb-6">€{property.price_per_night}</p>
              <button className="w-full bg-gradient-to-r from-primary-500 to-primary-600 text-white font-bold py-3 rounded-lg hover:shadow-lg transition">
                {auth?.user ? 'Reserve Now' : 'Sign in to book'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
