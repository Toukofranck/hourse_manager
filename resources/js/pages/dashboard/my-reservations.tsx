import React, { useEffect, useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { apiFetch } from '@/lib/api';

export default function MyReservations() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchReservations();
  }, []);

  async function fetchReservations() {
    setLoading(true);
    setError(null);
    try {
      const data = await apiFetch('/reservations');
      setReservations(data.data || data);
    } catch (err: any) {
      setError(err.message || 'Failed to load reservations');
    } finally {
      setLoading(false);
    }
  }

  return (
    <AppLayout>
      <Head title="My Reservations" />

      <div className="space-y-4">
        <h1 className="text-2xl font-bold">My Reservations</h1>

        {loading && <p>Loading...</p>}
        {error && <p className="text-red-600">{error}</p>}

        {!loading && reservations.length === 0 && (
          <p className="text-gray-600">You have no reservations yet.</p>
        )}

        <div className="grid gap-4">
          {reservations.map((r: any) => (
            <div key={r.id} className="border rounded p-4 bg-white">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="font-semibold">{r.property?.title || 'Property'}</h2>
                  <p className="text-sm text-gray-500">{r.property?.city} • {r.number_of_guests} guests</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">€{r.total_price}</p>
                  <p className="text-sm text-gray-500">{r.status}</p>
                </div>
              </div>

              <div className="mt-3 text-sm text-gray-700">
                <p>From: {new Date(r.check_in_date).toLocaleDateString()}</p>
                <p>To: {new Date(r.check_out_date).toLocaleDateString()}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
