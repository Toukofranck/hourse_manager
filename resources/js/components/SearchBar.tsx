import React, { useState } from 'react';
import { Search, MapPin, DollarSign, Users, Calendar } from 'lucide-react';

export default function SearchBar({ onSearch }) {
  const [searchData, setSearchData] = useState({
    city: '',
    check_in_date: '',
    check_out_date: '',
    guests: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSearchData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(searchData);
  };

  return (
    <form onSubmit={handleSearch} className="bg-white rounded-lg shadow-lg p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* City */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <MapPin size={18} className="inline mr-2" />
            City
          </label>
          <input
            type="text"
            name="city"
            placeholder="Paris, Lyon..."
            value={searchData.city}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Check-in Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Calendar size={18} className="inline mr-2" />
            Check-in
          </label>
          <input
            type="date"
            name="check_in_date"
            value={searchData.check_in_date}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Check-out Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Calendar size={18} className="inline mr-2" />
            Check-out
          </label>
          <input
            type="date"
            name="check_out_date"
            value={searchData.check_out_date}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Guests */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Users size={18} className="inline mr-2" />
            Guests
          </label>
          <input
            type="number"
            name="guests"
            placeholder="1"
            min="1"
            value={searchData.guests}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Search Button */}
        <div className="flex items-end">
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center gap-2"
          >
            <Search size={20} />
            Search
          </button>
        </div>
      </div>
    </form>
  );
}
