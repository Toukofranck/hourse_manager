import React, { useState } from 'react';
import { usePage } from '@inertiajs/react';
import { AlertCircle, CheckCircle } from 'lucide-react';

export default function ReservationForm({ propertyId, maxGuests, onClose, onSuccess }) {
  const { auth } = usePage().props;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    check_in_date: '',
    check_out_date: '',
    number_of_guests: 1,
    notes: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/reservations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${auth.token}`,
        },
        body: JSON.stringify({
          property_id: propertyId,
          ...formData,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create reservation');
      }

      setSuccess(true);
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
        <div className="flex gap-2 mb-2">
          <CheckCircle className="text-green-600" size={20} />
          <span className="font-semibold text-green-800">Reservation successful!</span>
        </div>
        <p className="text-sm text-green-700">Redirecting...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex gap-2">
          <AlertCircle className="text-red-600 flex-shrink-0" size={20} />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Check-in</label>
        <input
          type="date"
          name="check_in_date"
          required
          value={formData.check_in_date}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Check-out</label>
        <input
          type="date"
          name="check_out_date"
          required
          value={formData.check_out_date}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Guests</label>
        <input
          type="number"
          name="number_of_guests"
          min="1"
          max={maxGuests}
          required
          value={formData.number_of_guests}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
        <p className="text-xs text-gray-500 mt-1">Max {maxGuests} guests</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Notes (optional)</label>
        <textarea
          name="notes"
          rows="3"
          placeholder="Any special requests?"
          value={formData.notes}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded-lg transition"
        >
          {loading ? 'Reserving...' : 'Confirm Reservation'}
        </button>
        <button
          type="button"
          onClick={onClose}
          className="flex-1 border border-gray-300 hover:bg-gray-50 text-gray-700 font-bold py-2 px-4 rounded-lg"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
