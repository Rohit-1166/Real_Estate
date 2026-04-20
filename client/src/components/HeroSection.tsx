import React, { useState } from 'react';
import { Search, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function HeroSection() {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/properties?city=${query}`);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
      animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className="relative overflow-hidden rounded-[2.5rem] glass-panel p-10 md:p-24 text-center mb-16 border-white/5"
    >
      <div className="absolute inset-0 z-0 opacity-40 mix-blend-overlay hover:opacity-50 transition-opacity duration-1000">
        <img src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80" alt="luxury real estate" className="w-full h-full object-cover" />
      </div>
      <div className="relative z-10 flex flex-col items-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
          Find Your Dream <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-primary-500">Property</span>
        </h1>
        <p className="text-lg md:text-xl text-white/80 mb-10 max-w-2xl">
          Discover premium flats, villas, and houses perfectly crafted for an elevated lifestyle. Experience a seamless search with the finest listings.
        </p>

        <form onSubmit={handleSearch} className="w-full max-w-3xl glass-panel p-3 flex flex-col md:flex-row gap-3 shadow-2xl">
          <div className="flex-1 flex gap-2 items-center bg-white/5 rounded-xl px-4 py-3">
            <MapPin className="text-primary-300 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Search by city (e.g., Mumbai, Delhi)" 
              className="bg-transparent w-full text-white placeholder-white/50 focus:outline-none"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <button type="submit" className="glass-button flex items-center justify-center gap-2 py-3 px-8 text-lg w-full md:w-auto">
            <Search className="w-5 h-5" />
            Search
          </button>
        </form>
      </div>
    </motion.div>
  );
}
