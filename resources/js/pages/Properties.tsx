import React, { useState, useEffect } from 'react';
import { Head, usePage } from '@inertiajs/react';
import SearchBar from '../components/SearchBar';
import PropertyCard from '../components/PropertyCard';
import PropertyFilters from '../components/PropertyFilters';
import { Loader2 } from 'lucide-react';

export default function Properties() {
  const { auth } = usePage().props;
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    city: '',
    country: '',
    min_price: '',
    max_price: '',
    property_type: '',
    bedrooms: '',
    guests: '',
    check_in_date: '',
    check_out_date: '',
    sort_by: 'newest',
    search: '',
  });
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    total: 0,
  });

  useEffect(() => {
    fetchProperties();
  }, [filters]);

  const fetchProperties = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) queryParams.append(key, value);
      });
      queryParams.append('page', pagination.current_page);

      const response = await fetch(`/api/properties?${queryParams}`);
      const data = await response.json();
      
      setProperties(data.data);
      setPagination({
        current_page: data.current_page,
        last_page: data.last_page,
        total: data.total,
      });
    } catch (error) {
      console.error('Error fetching properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setPagination({ ...pagination, current_page: 1 });
  };

  const handlePageChange = (page) => {
    setPagination({ ...pagination, current_page: page });
    window.scrollTo(0, 0);
  };

  return (
    <>
      <Head title="Find Your Perfect Property" />
      <div className="min-h-screen bg-gray-50">
        {/* Search Section */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 py-12 px-4">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-4xl font-bold text-white mb-8">Find Your Perfect Home</h1>
            <SearchBar onSearch={handleFilterChange} />
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Filters Sidebar */}
            <PropertyFilters filters={filters} onFilterChange={handleFilterChange} />

            {/* Properties Grid */}
            <div className="lg:col-span-3">
              {loading ? (
                <div className="flex items-center justify-center h-96">
                  <Loader2 className="animate-spin" size={48} />
                </div>
              ) : (
                <>
                  <div className="mb-6 flex justify-between items-center">
                    <p className="text-gray-600">
                      Showing {properties.length} of {pagination.total} properties
                    </p>
                  </div>

                  {properties.length > 0 ? (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {properties.map((property) => (
                          <PropertyCard
                            key={property.id}
                            property={property}
                            isAuthenticated={!!auth.user}
                          />
                        ))}
                      </div>

                      {/* Pagination */}
                      {pagination.last_page > 1 && (
                        <div className="mt-8 flex justify-center gap-2">
                          {Array.from({ length: pagination.last_page }, (_, i) => i + 1).map((page) => (
                            <button
                              key={page}
                              onClick={() => handlePageChange(page)}
                              className={`px-4 py-2 rounded ${
                                page === pagination.current_page
                                  ? 'bg-blue-600 text-white'
                                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                              }`}
                            >
                              {page}
                            </button>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="text-center py-12">
                      <p className="text-gray-500 text-lg">No properties found. Try adjusting your filters.</p>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
