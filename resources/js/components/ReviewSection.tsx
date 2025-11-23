import React, { useState, useEffect } from 'react';
import { usePage } from '@inertiajs/react';
import { Star, Loader2 } from 'lucide-react';
import ReviewForm from './ReviewForm';

export default function ReviewSection({ propertyId }) {
  const { auth } = usePage().props;
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, [propertyId]);

  const fetchReviews = async () => {
    try {
      const response = await fetch(`/api/properties/${propertyId}/reviews`);
      const data = await response.json();
      setReviews(data.data || data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-32">
        <Loader2 className="animate-spin" size={32} />
      </div>
    );
  }

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-4">Guest Reviews</h2>

      {auth.user && showForm && (
        <ReviewForm
          propertyId={propertyId}
          onSuccess={() => {
            setShowForm(false);
            fetchReviews();
          }}
          onCancel={() => setShowForm(false)}
        />
      )}

      {reviews.length > 0 ? (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="border rounded-lg p-4 bg-white">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="font-semibold text-gray-900">{review.user.name}</p>
                  <div className="flex items-center gap-1 mt-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        className={i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-gray-500">
                  {new Date(review.created_at).toLocaleDateString()}
                </p>
              </div>
              <p className="text-gray-700 text-sm">{review.comment}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-center py-8">No reviews yet. Be the first to review!</p>
      )}
    </div>
  );
}
