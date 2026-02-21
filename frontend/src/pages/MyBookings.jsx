import React, { useState } from 'react';
import { getMyBookings } from '../api';
import { StatusBadge } from "../components/StatusBadge"
import { Search, Mail, Clock } from 'lucide-react';

const MyBookings = () => {
  const [email, setEmail] = useState('');
  const [bookings, setBookings] = useState([]);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    const { data } = await getMyBookings(email);
    setBookings(data);
    setSearched(true);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-black text-gray-900 mb-4">My Bookings</h1>
        <p className="text-gray-500">Enter your email to manage your appointments.</p>
      </div>

      <form onSubmit={handleSearch} className="flex gap-3 mb-12 max-w-lg mx-auto">
        <div className="relative flex-1">
          <Mail className="absolute left-4 top-3.5 text-gray-400" size={20} />
          <input 
            type="email" required
            className="w-full pl-12 pr-4 py-3.5 border rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <button type="submit" className="bg-indigo-600 text-white px-8 py-3.5 rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100">
          Search
        </button>
      </form>

      <div className="space-y-4">
        {bookings.length > 0 ? (
          bookings.map(b => (
            <div key={b._id} className="bg-white p-6 rounded-3xl border border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-indigo-100 transition-colors">
              <div className="flex gap-4 items-center">
                <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-indigo-600 font-bold">
                  {b.expertId?.name?.charAt(0) || "E"}
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-lg">{b.expertID?.name || "Expert Name"}</h4>
                  <div className="flex items-center gap-2 text-gray-400 text-sm">
                    <Clock size={14} /> {b.date} at {b.timeSlot}
                  </div>
                </div>
              </div>
              <StatusBadge status={b.status} />
            </div>
          ))
        ) : searched && (
          <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed">
            <h3 className="text-lg font-bold text-gray-600">No bookings found for this email.</h3>
            <p className="text-gray-400">Check the spelling or try another email.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;