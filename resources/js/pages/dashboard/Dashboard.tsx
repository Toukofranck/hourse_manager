import React from 'react';
import { Link } from '@inertiajs/react';
import { Home, Calendar, Settings, LogOut } from 'lucide-react';
import { User } from '@/types';

interface DashboardProps {
  auth: {
    user: User;
  };
}

export default function Dashboard({ auth }: DashboardProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">Welcome, {auth.user.name}</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* My Reservations Card */}
          <Link
            href="/dashboard/reservations"
            className="bg-white rounded-lg shadow-md hover:shadow-lg transition p-6"
          >
            <div className="flex items-center space-x-4">
              <Calendar className="h-12 w-12 text-blue-600" />
              <div>
                <h2 className="text-xl font-semibold text-gray-900">My Reservations</h2>
                <p className="text-gray-600">View and manage your bookings</p>
              </div>
            </div>
          </Link>

          {/* My Properties Card */}
          <Link
            href="/dashboard/properties"
            className="bg-white rounded-lg shadow-md hover:shadow-lg transition p-6"
          >
            <div className="flex items-center space-x-4">
              <Home className="h-12 w-12 text-green-600" />
              <div>
                <h2 className="text-xl font-semibold text-gray-900">My Properties</h2>
                <p className="text-gray-600">View your listed properties</p>
              </div>
            </div>
          </Link>

          {/* Manage Properties Card */}
          <Link
            href="/dashboard/properties-crud"
            className="bg-white rounded-lg shadow-md hover:shadow-lg transition p-6"
          >
            <div className="flex items-center space-x-4">
              <Settings className="h-12 w-12 text-purple-600" />
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Manage Properties</h2>
                <p className="text-gray-600">Add, edit, or delete properties</p>
              </div>
            </div>
          </Link>
        </div>

        {/* Quick Stats */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm font-medium">Total Bookings</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">0</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm font-medium">Active Properties</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">0</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm font-medium">Revenue</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">$0</p>
          </div>
        </div>
      </div>
    </div>
  );
}
