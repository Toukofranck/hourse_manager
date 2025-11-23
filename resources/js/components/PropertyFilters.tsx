import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export default function PropertyFilters({ filters, onFilterChange }) {
  const [expandedSections, setExpandedSections] = useState({
    location: true,
    price: true,
    property: true,
    amenities: false,
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleFilterChange = (key, value) => {
    onFilterChange({
      ...filters,
      [key]: value
    });
  };

  const propertyTypes = ['apartment', 'house', 'villa', 'studio', 'cottage', 'room'];

  const FilterSection = ({ title, section, children }) => (
    <div className="bg-white rounded-lg border p-4 mb-4">
      <button
        onClick={() => toggleSection(section)}
        className="w-full flex items-center justify-between font-semibold text-lg mb-3 hover:text-blue-600"
      >
        {title}
        <ChevronDown size={20} className={`transition ${expandedSections[section] ? 'rotate-180' : ''}`} />
      </button>
      {expandedSections[section] && <div>{children}</div>}
    </div>
  );

  return (
    <div className="lg:col-span-1">
      {/* Location */}
      <FilterSection title="Location" section="location">
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
            <input
              type="text"
              value={filters.city}
              onChange={(e) => handleFilterChange('city', e.target.value)}
              placeholder="Paris, Lyon..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
            <input
              type="text"
              value={filters.country}
              onChange={(e) => handleFilterChange('country', e.target.value)}
              placeholder="France..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </FilterSection>

      {/* Price */}
      <FilterSection title="Price" section="price">
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Min Price</label>
            <input
              type="number"
              value={filters.min_price}
              onChange={(e) => handleFilterChange('min_price', e.target.value)}
              placeholder="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Max Price</label>
            <input
              type="number"
              value={filters.max_price}
              onChange={(e) => handleFilterChange('max_price', e.target.value)}
              placeholder="10000"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </FilterSection>

      {/* Property Type */}
      <FilterSection title="Property Type" section="property">
        <div className="space-y-2">
          {propertyTypes.map(type => (
            <label key={type} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.property_type === type}
                onChange={() => handleFilterChange('property_type', filters.property_type === type ? '' : type)}
                className="rounded"
              />
              <span className="text-sm text-gray-700 capitalize">{type}</span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Bedrooms */}
      <FilterSection title="Bedrooms" section="amenities">
        <div className="space-y-2">
          {[1, 2, 3, 4].map(num => (
            <label key={num} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="bedrooms"
                checked={filters.bedrooms === num.toString()}
                onChange={() => handleFilterChange('bedrooms', num.toString())}
                className="rounded"
              />
              <span className="text-sm text-gray-700">{num}+ bedrooms</span>
            </label>
          ))}
          {filters.bedrooms && (
            <button
              onClick={() => handleFilterChange('bedrooms', '')}
              className="text-sm text-blue-600 hover:underline"
            >
              Clear
            </button>
          )}
        </div>
      </FilterSection>

      {/* Sorting */}
      <div className="bg-white rounded-lg border p-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
        <select
          value={filters.sort_by}
          onChange={(e) => handleFilterChange('sort_by', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
        >
          <option value="newest">Newest</option>
          <option value="rating">Highest Rated</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
        </select>
      </div>

      {/* Reset Button */}
      <button
        onClick={() => onFilterChange({
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
        })}
        className="w-full mt-4 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-medium"
      >
        Reset Filters
      </button>
    </div>
  );
}
