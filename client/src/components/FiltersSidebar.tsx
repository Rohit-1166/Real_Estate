import React, { useState, useEffect } from 'react';
import api from '../services/api';

export default function FiltersSidebar({ onFilterChange }: { onFilterChange: (filters: any) => void }) {
  const [cities, setCities] = useState([]);
  const [types, setTypes] = useState([]);
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  useEffect(() => {
    const fetchRefs = async () => {
      try {
        const [citiesRes, typesRes] = await Promise.all([
          api.get('/references/cities'),
          api.get('/references/types')
        ]);
        setCities(citiesRes.data);
        setTypes(typesRes.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchRefs();
  }, []);

  const applyFilters = () => {
    onFilterChange({
      city_id: selectedCity,
      type_id: selectedType,
      min_price: minPrice,
      max_price: maxPrice
    });
  };

  return (
    <div className="glass-panel p-6 flex flex-col gap-6 sticky top-24">
      <h3 className="text-xl font-bold text-white border-b border-white/10 pb-4">Filters</h3>
      
      <div className="flex flex-col gap-2">
        <label className="text-sm text-white/70">City</label>
        <select 
          className="glass-input appearance-none bg-slate-900/50"
          value={selectedCity} 
          onChange={(e) => setSelectedCity(e.target.value)}
        >
          <option value="">All Cities</option>
          {cities.map((c: any) => (
            <option key={c.city_id} value={c.city_id}>{c.city_name}</option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm text-white/70">Property Type</label>
        <select 
          className="glass-input appearance-none bg-slate-900/50"
          value={selectedType} 
          onChange={(e) => setSelectedType(e.target.value)}
        >
          <option value="">All Types</option>
          {types.map((t: any) => (
            <option key={t.type_id} value={t.type_id}>{t.type_name}</option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm text-white/70">Price Range (₹)</label>
        <div className="flex gap-2">
          <input 
            type="number" 
            placeholder="Min" 
            className="glass-input w-1/2" 
            value={minPrice} 
            onChange={(e) => setMinPrice(e.target.value)}
          />
          <input 
            type="number" 
            placeholder="Max" 
            className="glass-input w-1/2" 
            value={maxPrice} 
            onChange={(e) => setMaxPrice(e.target.value)}
          />
        </div>
      </div>

      <button onClick={applyFilters} className="glass-button w-full mt-4">
        Apply Filters
      </button>
    </div>
  );
}
