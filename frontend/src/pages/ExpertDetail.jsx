import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getExpertById, createBooking } from '../api';
import { Calendar, Clock, Star, ShieldCheck, ChevronLeft, Award } from 'lucide-react';
import io from 'socket.io-client';

const ExpertDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [expert, setExpert] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', notes: '' });

  useEffect(() => {
    
    if (!id || id.includes('[object')) return;

    const fetch = async () => {
      try {
        const { data } = await getExpertById(id);
        setExpert(data);
      } catch (err) {
        console.error("Error loading expert:", err);
      }
    };
    fetch();

    const socket = io('http://localhost:7071');
    socket.on('slotBooked', (data) => {
      if (data.expertId === id) {
        setExpert(prev => ({
          ...prev,
          availableSlots: prev.availableSlots.map(s => 
            (s.date === data.date && s.time === data.timeSlot) ? { ...s, isBooked: true } : s
          )
        }));
      }
    });
    return () => socket.disconnect();
  }, [id]);

  if (!expert) return <div className="p-20 text-center animate-pulse text-gray-400">Loading Expert Profile...</div>;

  const groupedSlots = expert.availableSlots.reduce((acc, slot) => {
    if (!acc[slot.date]) acc[slot.date] = [];
    acc[slot.date].push(slot);
    return acc;
  }, {});

  const handleBooking = async (e) => {
    e.preventDefault();
    if (!selectedSlot) return alert("Please select a time slot");
    try {
      await createBooking({
        expertId: id,
        ...formData,
        date: selectedSlot.date,
        timeSlot: selectedSlot.time
      });
      alert("Booking Confirmed Successfully!");
      navigate('/my-bookings');
    } catch (err) {
      alert(err.response?.data?.message || "Booking failed");
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8">
      <button onClick={() => navigate('/')} className="flex items-center text-gray-500 hover:text-indigo-600 mb-8 transition-colors">
        <ChevronLeft size={20} /> Back to Experts
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        
        {/* LEFT COLUMN: PROFILE */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm sticky top-24">
            <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl mb-6 flex items-center justify-center text-4xl font-bold text-white shadow-lg">
              {expert.name.charAt(0)}
            </div>
            <h1 className="text-3xl font-black text-gray-900 mb-1">{expert.name}</h1>
            <p className="text-indigo-600 font-bold tracking-widest text-xs uppercase mb-6">{expert.category} Expert</p>
            
            <div className="space-y-4 border-t border-gray-50 pt-6">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400 flex items-center gap-2"><Star size={16} className="text-yellow-400 fill-yellow-400" /> Rating</span>
                <span className="font-bold text-gray-800">{expert.rating || '4.9'}/5.0</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400 flex items-center gap-2"><Award size={16} className="text-indigo-400" /> Experience</span>
                <span className="font-bold text-gray-800">{expert.experience} Years</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400 flex items-center gap-2"><ShieldCheck size={16} className="text-green-400" /> Verified</span>
                <span className="font-bold text-green-600">Pro Member</span>
              </div>
            </div>

            <div className="mt-8">
              <h4 className="text-sm font-bold text-gray-900 mb-2">About Masterclass</h4>
              <p className="text-gray-500 text-sm leading-relaxed">
                Expert in {expert.category} with a focus on practical implementation. Join this session to get 1-on-1 mentorship and tailored advice.
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: SLOTS & BOOKING */}
        <div className="lg:col-span-2 space-y-10">
          
          {/* Slot Selection Section */}
          <section>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-gray-800">
              <Calendar className="text-indigo-600" size={24} /> 1. Select Available Slot
            </h2>
            
            {Object.keys(groupedSlots).length > 0 ? Object.keys(groupedSlots).map(date => (
              <div key={date} className="mb-8 last:mb-0">
                <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <div className="h-px bg-gray-100 flex-1"></div> {date} <div className="h-px bg-gray-100 flex-1"></div>
                </h4>
                <div className="flex flex-wrap gap-3">
                  {groupedSlots[date].map((slot, idx) => (
                    <button
                      key={idx}
                      disabled={slot.isBooked}
                      onClick={() => setSelectedSlot(slot)}
                      className={`px-6 py-3 rounded-2xl text-sm font-bold border transition-all duration-200 ${
                        slot.isBooked 
                          ? 'bg-gray-50 text-gray-300 border-transparent cursor-not-allowed line-through' 
                          : selectedSlot === slot 
                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-xl shadow-indigo-100 scale-105' 
                            : 'bg-white text-gray-600 border-gray-200 hover:border-indigo-600 hover:text-indigo-600 hover:bg-indigo-50'
                      }`}
                    >
                      {slot.time}
                    </button>
                  ))}
                </div>
              </div>
            )) : (
              <p className="text-gray-400 bg-gray-50 p-6 rounded-2xl text-center border-2 border-dashed">No slots currently available for this expert.</p>
            )}
          </section>

          {/* Booking Form Section */}
          {selectedSlot && (
            <section className="bg-gray-900 rounded-[2rem] p-8 md:p-10 shadow-2xl animate-in slide-in-from-bottom-8 duration-500">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-2">2. Confirm Booking</h2>
                <p className="text-indigo-300 text-sm">You are booking for <span className="text-white font-bold">{selectedSlot.time}</span> on <span className="text-white font-bold">{selectedSlot.date}</span></p>
              </div>

              <form onSubmit={handleBooking} className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-indigo-300 uppercase ml-1">Full Name</label>
                  <input required className="w-full bg-gray-800 border-none rounded-2xl p-4 text-white focus:ring-2 focus:ring-indigo-500 outline-none" 
                    onChange={e => setFormData({...formData, name: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-indigo-300 uppercase ml-1">Email Address</label>
                  <input required type="email" className="w-full bg-gray-800 border-none rounded-2xl p-4 text-white focus:ring-2 focus:ring-indigo-500 outline-none" 
                    onChange={e => setFormData({...formData, email: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-indigo-300 uppercase ml-1">Phone Number</label>
                  <input required className="w-full bg-gray-800 border-none rounded-2xl p-4 text-white focus:ring-2 focus:ring-indigo-500 outline-none" 
                    onChange={e => setFormData({...formData, phone: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-indigo-300 uppercase ml-1">Notes (Optional)</label>
                  <input className="w-full bg-gray-800 border-none rounded-2xl p-4 text-white focus:ring-2 focus:ring-indigo-500 outline-none" 
                    onChange={e => setFormData({...formData, notes: e.target.value})} />
                </div>
                <button type="submit" className="md:col-span-2 bg-indigo-500 hover:bg-indigo-400 text-white py-5 rounded-2xl font-black text-xl transition-all shadow-lg shadow-indigo-900/20 mt-4">
                  Confirm Booking Now
                </button>
              </form>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExpertDetail;