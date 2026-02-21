import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getExperts } from '../api';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';

const ExpertListing = () => {
  const [experts, setExperts] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  const navigate = useNavigate();

  useEffect(() => {
    const fetch = async () => {
      try {
        
        const { data } = await getExperts(page, search, category);
        
      
        setExperts(data.experts || []);
        setTotalPages(data.totalPages || 1);
      } catch (err) { 
        console.error("Fetch error:", err); 
      }
    };
    fetch();
  }, [search, category, page]); 

  
  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const getCleanId = (id) => {
    if (!id) return '';
    return typeof id === 'object' ? id.$oid : id;
  };

  return (
    <div className="max-w-6xl mx-auto p-6 min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
        <h1 className="text-4xl font-black text-gray-900">Available Experts</h1>
        
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-3.5 text-gray-400" size={20} />
          <input 
            className="w-full pl-12 pr-4 py-3 border-2 border-gray-100 rounded-2xl outline-none focus:border-indigo-500 transition-all shadow-sm" 
            placeholder="Search by name..." 
            value={search}
            onChange={handleSearchChange}
          />
        </div>
      </div>

      {/* EXPERT GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {experts.length > 0 ? (
          experts.map(exp => (
            <div key={getCleanId(exp._id)} className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 font-bold text-xl mb-4">
                {exp.name.charAt(0)}
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">{exp.name}</h3>
              <p className="text-indigo-600 font-medium mb-6">{exp.category}</p>
              
              <button 
                onClick={() => navigate(`/expert/${getCleanId(exp._id)}`)}
                className="w-full bg-gray-900 text-white py-3.5 rounded-2xl font-bold hover:bg-indigo-600 transition-colors shadow-lg shadow-gray-100"
              >
                View Profile
              </button>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
            <p className="text-gray-500 font-medium">No experts found matching your criteria.</p>
          </div>
        )}
      </div>

    
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-16 mb-12">
          <button
            disabled={page === 1}
            onClick={() => setPage(p => Math.max(1, p - 1))}
            className="p-3 rounded-xl border-2 border-gray-100 bg-white hover:border-indigo-500 hover:text-indigo-600 disabled:opacity-30 transition-all"
          >
            <ChevronLeft size={24} />
          </button>

          <div className="flex gap-2">
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`w-12 h-12 rounded-xl font-bold transition-all ${
                  page === i + 1 
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100" 
                    : "bg-white text-gray-500 border-2 border-gray-100 hover:border-indigo-200"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>

          <button
            disabled={page === totalPages}
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            className="p-3 rounded-xl border-2 border-gray-100 bg-white hover:border-indigo-500 hover:text-indigo-600 disabled:opacity-30 transition-all"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      )}
    </div>
  );
};

export default ExpertListing;