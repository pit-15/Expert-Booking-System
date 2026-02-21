import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getExperts } from '../api';
import { Search } from 'lucide-react';

const ExpertListing = () => {
  const [experts, setExperts] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await getExperts(1, search, category);
        setExperts(data.experts);
      } catch (err) { console.error(err); }
    };
    fetch();
  }, [search, category]);

  const getCleanId = (id) => {
    if (!id) return '';
    return typeof id === 'object' ? id.$oid : id;
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Available Experts</h1>
      <div className="flex gap-4 mb-10">
        <input 
          className="flex-1 p-3 border rounded-xl outline-none" 
          placeholder="Search name..." 
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {experts.map(exp => (
          <div key={getCleanId(exp._id)} className="bg-white p-6 rounded-2xl border shadow-sm">
            <h3 className="text-xl font-bold">{exp.name}</h3>
            <p className="text-indigo-600 mb-4">{exp.category}</p>
            <button 
              onClick={() => navigate(`/expert/${getCleanId(exp._id)}`)}
              className="w-full bg-indigo-600 text-white py-2 rounded-lg font-bold"
            >
              View Profile
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExpertListing;