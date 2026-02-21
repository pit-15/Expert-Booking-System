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

  if (!expert) return <div className="p-20 text-center animate-pulse text-gray-400 font-bold">Loading Expert Profile...</div>;

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
    <div className="min-h-screen bg-gray-50/50 py-8 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        <button 
          onClick={() => navigate('/')} 
          className="flex items-center gap-2 text-gray-400 hover:text-indigo-600 mb-10 transition-all font-bold group"
        >
          <div className="p-2 rounded-xl bg-white shadow-sm group-hover:bg-indigo-50 transition-colors border border-gray-100">
            <ChevronLeft size={20} />
          </div>
          Back to Experts
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* PROFILE CARD */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-gray-100 rounded-[2.5rem] p-8 shadow-xl shadow-gray-200/50 sticky top-10">
              <div className="relative inline-block mb-8">
                <div className="w-28 h-28 bg-gradient-to-br from-indigo-600 to-violet-700 rounded-3xl flex items-center justify-center text-4xl font-black text-white shadow-2xl shadow-indigo-200">
                  {expert.name.charAt(0)}
                </div>
                <div className="absolute -bottom-2 -right-2 bg-green-500 border-4 border-white w-8 h-8 rounded-full flex items-center justify-center">
                   <ShieldCheck size={16} className="text-white" />
                </div>
              </div>

              <h1 className="text-4xl font-black text-gray-900 mb-2">{expert.name}</h1>
              <span className="inline-block px-4 py-1.5 rounded-full bg-indigo-50 text-indigo-600 font-bold text-xs uppercase tracking-tighter mb-8">
                {expert.category} Professional
              </span>
              
              <div className="space-y-5 border-t border-gray-100 pt-8">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-sm flex items-center gap-2"><Star size={18} className="text-yellow-400 fill-yellow-400" /> Rating</span>
                  <span className="font-black text-gray-900">{expert.rating || '4.9'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-sm flex items-center gap-2"><Award size={18} className="text-indigo-500" /> Experience</span>
                  <span className="font-black text-gray-900">{expert.experience} Years</span>
                </div>
              </div>

              <div className="mt-10 p-6 bg-gray-50 rounded-3xl">
                <h4 className="text-sm font-black text-gray-900 mb-3 uppercase">Mentorship Focus</h4>
                <p className="text-gray-500 text-sm leading-relaxed font-medium">
                  Personalized 1-on-1 sessions focusing on practical implementation of {expert.category} strategies.
                </p>
              </div>
            </div>
          </div>

          {/* SLOTS & BOOKING */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Slot Selection Card */}
            <section className="bg-white border border-gray-100 rounded-[2.5rem] p-8 md:p-10 shadow-sm">
              <h2 className="text-2xl font-black mb-8 flex items-center gap-4 text-gray-900">
                <div className="p-3 bg-indigo-600 rounded-2xl text-white">
                  <Calendar size={24} />
                </div>
                1. Pick Your Time
              </h2>
              
              {Object.keys(groupedSlots).length > 0 ? Object.keys(groupedSlots).map(date => (
                <div key={date} className="mb-10 last:mb-0">
                  <h4 className="text-xs font-black text-gray-300 uppercase tracking-[0.2em] mb-6 flex items-center gap-4">
                    <span className="whitespace-nowrap">{date}</span>
                    <div className="h-px bg-gray-100 w-full"></div>
                  </h4>
                  <div className="flex flex-wrap gap-4">
                    {groupedSlots[date].map((slot, idx) => (
                      <button
                        key={idx}
                        disabled={slot.isBooked}
                        onClick={() => setSelectedSlot(slot)}
                        className={`px-8 py-4 rounded-2xl text-sm font-black transition-all duration-300 transform active:scale-95 ${
                          slot.isBooked 
                            ? 'bg-gray-50 text-gray-300 cursor-not-allowed border-transparent line-through' 
                            : selectedSlot === slot 
                              ? 'bg-indigo-600 text-white shadow-2xl shadow-indigo-200 -translate-y-1' 
                              : 'bg-white text-gray-600 border-2 border-gray-100 hover:border-indigo-600 hover:text-indigo-600 hover:shadow-lg'
                        }`}
                      >
                        {slot.time}
                      </button>
                    ))}
                  </div>
                </div>
              )) : (
                <div className="text-center py-16 bg-gray-50 rounded-[2rem] border-2 border-dashed border-gray-200">
                   <Clock className="mx-auto text-gray-300 mb-4" size={40} />
                   <p className="text-gray-400 font-bold">No slots available this week.</p>
                </div>
              )}
            </section>

            {/* Form Section */}
            {selectedSlot && (
              <section className="bg-gray-900 rounded-[3rem] p-10 shadow-2xl">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
                  <div>
                    <h2 className="text-3xl font-black text-white mb-2">2. Finalize Booking</h2>
                    <p className="text-indigo-300 font-medium">Securing your session for {selectedSlot.date}</p>
                  </div>
                  <div className="bg-indigo-500/10 border border-indigo-500/20 px-6 py-3 rounded-2xl">
                    <span className="text-indigo-400 text-xs font-black uppercase block">Selected Time</span>
                    <span className="text-white font-black text-lg">{selectedSlot.time}</span>
                  </div>
                </div>

                <form onSubmit={handleBooking} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-indigo-300 uppercase tracking-widest ml-2">Full Name</label>
                    <input 
                      required 
                      className="w-full bg-gray-800/50 border-2 border-transparent focus:border-indigo-500 rounded-2xl p-4 text-white outline-none transition-all" 
                      onChange={e => setFormData({...formData, name: e.target.value})} 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-indigo-300 uppercase tracking-widest ml-2">Email Address</label>
                    <input 
                      required type="email"
                      className="w-full bg-gray-800/50 border-2 border-transparent focus:border-indigo-500 rounded-2xl p-4 text-white outline-none transition-all" 
                      onChange={e => setFormData({...formData, email: e.target.value})} 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-indigo-300 uppercase tracking-widest ml-2">Phone</label>
                    <input 
                      required 
                      className="w-full bg-gray-800/50 border-2 border-transparent focus:border-indigo-500 rounded-2xl p-4 text-white outline-none transition-all" 
                      onChange={e => setFormData({...formData, phone: e.target.value})} 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-indigo-300 uppercase tracking-widest ml-2">Notes</label>
                    <input 
                      className="w-full bg-gray-800/50 border-2 border-transparent focus:border-indigo-500 rounded-2xl p-4 text-white outline-none transition-all" 
                      onChange={e => setFormData({...formData, notes: e.target.value})} 
                    />
                  </div>
                  <button type="submit" className="md:col-span-2 bg-indigo-500 hover:bg-indigo-400 text-white py-6 rounded-3xl font-black text-xl transition-all shadow-xl shadow-indigo-500/20 mt-6 active:scale-[0.98]">
                    Confirm Appointment
                  </button>
                </form>
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpertDetail;