import React, { useState } from 'react';
import { usePage } from '@inertiajs/react';
import { AlertCircle, CheckCircle, Star } from 'lucide-react';

export default function ReviewForm({ propertyId, onSuccess, onCancel }) {
  const { auth } = usePage().props;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    reservation_id: '',
    rating: 5,
    comment: '',
  });
  const [reservations, setReservations] = useState([]);

  React.useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      const response = await fetch('/api/reservations?status=completed', {
        headers: {
          'Authorization': `Bearer ${auth.token}`,
        },
      });
      const data = await response.json();
      setReservations(data.data.filter(r => r.property_id === propertyId));
    } catch (error) {
      console.error('Error fetching reservations:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${auth.token}`,
        },
        body: JSON.stringify({
          reservation_id: parseInt(formData.reservation_id),
          rating: parseInt(formData.rating),
          comment: formData.comment,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create review');
      }

      setSuccess(true);
      setTimeout(() => {
        onSuccess();
      }, 1500);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="p-4 bg-green-50 border border-green-200 rounded-lg mb-4">
        <div className="flex gap-2">
          <CheckCircle className="text-green-600" size={20} />
          <span className="font-semibold text-green-800">Review submitted successfully!</span>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="border rounded-lg p-4 bg-blue-50 mb-4">
      <h3 className="font-bold mb-4">Share Your Experience</h3>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex gap-2 mb-4">
          <AlertCircle className="text-red-600 flex-shrink-0" size={20} />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Reservation</label>
          <select
            value={formData.reservation_id}
            onChange={(e) => setFormData(prev => ({ ...prev, reservation_id: e.target.value }))}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select a reservation</option>
            {reservations.map(res => (
              <option key={res.id} value={res.id}>
                {res.property?.title} - {new Date(res.check_in_date).toLocaleDateString()}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map(num => (
              <button
                key={num}
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, rating: num }))}
                className="focus:outline-none"
              >
                <Star
                  size={28}
                  className={num <= formData.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}
                />
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Comment</label>
          <textarea
            value={formData.comment}
            onChange={(e) => setFormData(prev => ({ ...prev, comment: e.target.value }))}
            required
            placeholder="Share your experience..."
            minLength={10}
            rows="4"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded-lg"
          >
            {loading ? 'Submitting...' : 'Submit Review'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 border border-gray-300 hover:bg-gray-50 text-gray-700 font-bold py-2 px-4 rounded-lg"
          >
            Cancel
          </button>
        </div>
      </div>
    </form>
  );
}
