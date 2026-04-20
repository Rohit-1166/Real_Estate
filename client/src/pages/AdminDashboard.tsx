import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [data, setData] = useState<any>(null);
  const [view, setView] = useState('dashboard');
  const [loading, setLoading] = useState(true);

  // Retrieve user info for the Admin Panel
  const [adminUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : { name: 'Admin', email: 'admin@system.com' };
  });

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      // Ensure your api utility includes the Bearer token from localStorage automatically
      const res = await api.get('/dashboards/admin');
      console.log("API Response:", res.data); // DEBUG: Check your console!
      setData(res.data);
    } catch (err) {
      console.error("Fetch Failed:", err);
      // If unauthorized, kick to login
      navigate('/login');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (loading) return (
    <div className="h-screen bg-[#050505] flex flex-col items-center justify-center">
      <div className="w-10 h-10 border-4 border-[#9333ea] border-t-transparent rounded-full animate-spin"></div>
      <p className="mt-4 text-gray-500 font-mono text-xs uppercase tracking-widest">Accessing Secure Layer...</p>
    </div>
  );

  return (
    <div className="flex bg-[#050505] min-h-screen text-white font-sans">
      
      {/* SIDEBAR */}
      <div className="w-72 border-r border-[#222225] bg-[#070708] flex flex-col p-6 h-screen sticky top-0">
        <h1 className="text-[#9333ea] font-black text-2xl tracking-tighter mb-10">WASHUB</h1>

        {/* ADMIN INFO PANEL */}
        <div className="bg-[#131315] border border-[#222225] p-4 rounded-2xl mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#9333ea] rounded-full flex items-center justify-center font-bold">
              {adminUser.name?.charAt(0)}
            </div>
            <div className="truncate">
              <p className="text-sm font-bold truncate">{adminUser.name}</p>
              <p className="text-[10px] text-gray-500 uppercase tracking-tighter">System Administrator</p>
            </div>
          </div>
        </div>

        {/* NAVIGATION */}
        <nav className="flex-1 space-y-2">
          <button onClick={() => setView('dashboard')} className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition-all ${view === 'dashboard' ? 'bg-[#9333ea] shadow-lg shadow-[#9333ea]/20' : 'text-gray-400 hover:bg-white/5'}`}>
            Overview
          </button>
          <button onClick={() => setView('users')} className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition-all ${view === 'users' ? 'bg-[#9333ea]' : 'text-gray-400 hover:bg-white/5'}`}>
            User Management
          </button>
          <button onClick={() => setView('inventory')} className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition-all ${view === 'inventory' ? 'bg-[#9333ea]' : 'text-gray-400 hover:bg-white/5'}`}>
            Inventory
          </button>
        </nav>

        {/* LOGOUT BUTTON */}
        <button 
          onClick={handleLogout}
          className="mt-auto flex items-center justify-center gap-2 w-full p-4 rounded-2xl border border-red-500/20 text-red-500 font-bold text-sm hover:bg-red-500 hover:text-white transition-all"
        >
          <span>LOGOUT SYSTEM</span>
        </button>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 p-10 overflow-y-auto">
        
        {view === 'dashboard' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#131315] p-8 rounded-[32px] border border-[#222225]">
              <p className="text-gray-500 text-xs uppercase font-bold mb-2">Revenue: Sales</p>
              <h2 className="text-4xl font-bold">${data?.financials?.totalSales?.toLocaleString() || '0'}</h2>
            </div>
            <div className="bg-[#131315] p-8 rounded-[32px] border border-[#222225]">
              <p className="text-gray-500 text-xs uppercase font-bold mb-2">Revenue: Rent</p>
              <h2 className="text-4xl font-bold">${data?.financials?.totalRent?.toLocaleString() || '0'}</h2>
            </div>
          </div>
        )}

        {view === 'users' && (
          <div className="space-y-8">
            <h2 className="text-2xl font-bold">Agents & Clients</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Agent List */}
              <div className="space-y-4">
                <h3 className="text-[#9333ea] text-xs font-bold uppercase">Agents ({data?.agents?.length || 0})</h3>
                {data?.agents?.map((a: any) => (
                  <div key={a.agent_id} className="bg-[#131315] p-4 rounded-xl border border-[#222225]">
                    <p className="font-bold">{a.name}</p>
                    <p className="text-xs text-gray-500">{a.email}</p>
                  </div>
                ))}
              </div>
              {/* Client List */}
              <div className="space-y-4">
                <h3 className="text-[#9333ea] text-xs font-bold uppercase">Clients ({data?.clients?.length || 0})</h3>
                {data?.clients?.map((c: any) => (
                  <div key={c.client_id} className="bg-[#131315] p-4 rounded-xl border border-[#222225]">
                    <p className="font-bold">{c.name}</p>
                    <p className="text-xs text-gray-500">{c.type}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {view === 'inventory' && (
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             {data?.properties?.map((p: any) => (
               <div key={p.property_id} onClick={() => navigate(`/properties/${p.property_id}`)} className="bg-[#131315] p-6 rounded-2xl border border-[#222225] cursor-pointer hover:border-[#9333ea] transition-all">
                  <h4 className="font-bold">Prop #{p.property_id}</h4>
                  <p className="text-sm text-gray-500">{p.city_name} - {p.status}</p>
                  <p className="mt-2 text-[#a855f7] font-bold">${(p.selling_price || p.rent_price).toLocaleString()}</p>
               </div>
             ))}
           </div>
        )}

      </div>
    </div>
  );
}