import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import ExpertListing from './pages/ExpertListing';
import ExpertDetail from './pages/ExpertDetail';
import MyBookings from './pages/MyBookings';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 text-gray-900">
        <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <Link to="/" className="text-xl font-bold text-indigo-600">ExpertHub</Link>
            <div className="space-x-8">
              <Link to="/" className="text-sm font-medium hover:text-indigo-600">Find Experts</Link>
              <Link to="/my-bookings" className="text-sm font-medium hover:text-indigo-600">My Bookings</Link>
            </div>
          </div>
        </nav>
        <main className="max-w-7xl mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<ExpertListing />} />
            <Route path="/expert/:id" element={<ExpertDetail />} />
            <Route path="/my-bookings" element={<MyBookings />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;