import React, { useEffect, useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { apiFetch } from '@/lib/api';

export default function MyProperties() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProperties();
  }, []);

  async function fetchProperties() {
    setLoading(true);
    setError(null);
    try {
      const data = await apiFetch('/my-properties');
      setProperties(data.data || data);
    } catch (err: any) {
      setError(err.message || 'Failed to load properties');
    } finally {
      setLoading(false);
    }
  }

  return (
    <AppLayout>
      <Head title="My Properties" />

      <div className="space-y-4">
        <h1 className="text-2xl font-bold">My Properties</h1>

        {loading && <p>Loading...</p>}
        {error && <p className="text-red-600">{error}</p>}

        {!loading && properties.length === 0 && (
          <p className="text-gray-600">You have not created any properties yet.</p>
        )}

        <div className="grid gap-4">
          {properties.map((p: any) => (
            <div key={p.id} className="border rounded p-4 bg-white">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="font-semibold">{p.title}</h2>
                  <p className="text-sm text-gray-500">{p.city} • {p.property_type}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">€{p.price_per_night}</p>
                  <p className="text-sm text-gray-500">{p.reviews_count} reviews</p>
                </div>
              </div>

              <div className="mt-3 text-sm text-gray-700">
                <p>{p.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
