import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function OwnerDashboard() {
  const navigate = useNavigate();
  const [data, setData] = useState<any>(null);
  
  // Profile settings state
  const [showProfile, setShowProfile] = useState(false);
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user') || '{}'));
  const [profileForm, setProfileForm] = useState({ name: user.name || '', email: user.email || '', phone: user.phone || '' });
  const [profileMessage, setProfileMessage] = useState('');

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get('/dashboards/owner');
        setData(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchDashboard();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
     e.preventDefault();
     setProfileMessage('Updating...');
     try {
       const res = await api.put('/auth/profile', profileForm);
       localStorage.setItem('user', JSON.stringify(res.data.user));
       setUser(res.data.user);
       setProfileMessage('Profile updated successfully!');
       setTimeout(() => { setShowProfile(false); setProfileMessage(''); }, 1500);
     } catch (err) {
       setProfileMessage('Error updating profile.');
     }
  };

  const navItems = [
    { name: 'Dashboard', path: '/owner' },
    { name: 'Properties', path: '/properties' },
    { name: 'Logout', path: '/login' }
  ];

  const formatCurrency = (val: number) => {
    if (!val) return '$0';
    if (val >= 1000000) return '$' + (val / 1000000).toFixed(2) + 'M';
    return '$' + val.toLocaleString();
  };

  return (
    <div className="flex bg-[#050505] min-h-screen font-sans text-white">
      {/* Sidebar */}
      <div className="w-64 border-r border-[#222225] p-8 flex flex-col justify-between hidden lg:flex h-screen sticky top-0">
        <div>
          <h2 className="text-white font-display font-bold tracking-widest text-xl mb-12 uppercase cursor-pointer" onClick={() => navigate('/')}>WASHUB</h2>
          
          <div className="flex items-center gap-4 mb-10">
            <div className="w-10 h-10 rounded-full bg-gray-800 overflow-hidden border border-[#222225] text-white flex items-center justify-center font-bold text-xl uppercase bg-[#3b82f6]/20 text-[#3b82f6]">
               {user.name ? user.name[0] : 'O'}
            </div>
            <div>
              <p className="text-white text-[13px] font-bold">{user.name || 'Owner'}</p>
              <p className="text-gray-500 text-[9px] uppercase tracking-wider">Asset Proprietor</p>
            </div>
          </div>

          <button className="w-full bg-gradient-to-r from-[#3b82f6] to-[#1d4ed8] text-white text-[11px] font-bold tracking-widest uppercase py-3.5 mb-8 rounded-[14px] hover:scale-[1.02] shadow-[0_0_20px_rgba(59,130,246,0.3)] transition-all">
            Add Property
          </button>

          <nav className="space-y-2">
            {navItems.map((item, i) => (
              <button 
                key={item.name} 
                onClick={() => {
                  if (item.path === '/login') handleLogout();
                  else navigate(item.path);
                }}
                className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-[14px] transition-all font-bold text-[13px] ${i === 0 ? 'bg-gradient-to-r from-[#3b82f6] to-[#1d4ed8] text-white shadow-[0_0_20px_rgba(59,130,246,0.3)]' : 'text-gray-400 hover:text-white hover:bg-[#131315]'}`}
              >
                <div className="w-4 h-4 bg-current opacity-70 mask-icon"></div>
                {item.name}
              </button>
            ))}
          </nav>
        </div>
        
        <div className="space-y-2">
            <button onClick={() => setShowProfile(true)} className="w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all font-bold text-[13px] text-gray-500 hover:text-white hover:bg-[#131315]">
                Settings
            </button>
            <button className="w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all font-bold text-[13px] text-gray-500 hover:text-white hover:bg-[#131315]">
                Concierge
            </button>
             <button onClick={handleLogout} className="w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all font-bold text-[13px] text-red-500 hover:text-white hover:bg-[#131315]">
                Sign Out
            </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 lg:p-12 bg-[#0a0a0c]">
        {/* Header */}
        <div className="flex justify-between items-start mb-10">
          <div>
            <p className="text-[10px] tracking-[0.2em] font-bold text-[#3b82f6] uppercase mb-2">Proprietor Network</p>
            <h1 className="text-4xl font-display font-bold mb-2">Asset Intelligence.</h1>
          </div>
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 border border-[#222225] bg-[#131315] px-4 py-2 rounded-full hover:bg-[#222225] transition-colors">
              <span className="text-[10px] font-bold tracking-widest uppercase text-gray-300">Valuation: Current</span>
            </button>
          </div>
        </div>

        {/* Top 3 Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {/* Card 1 */}
          <div className="bg-[#131315] border border-[#222225] rounded-[24px] p-8">
             <div className="w-8 h-8 rounded-full bg-[#3b82f6]/20 flex justify-center items-center mb-6">
                <svg className="w-4 h-4 text-[#3b82f6]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="6" width="20" height="12" rx="2"/><path d="M12 12h.01"/></svg>
             </div>
             <p className="text-[11px] font-medium text-gray-400 mb-2">Total Net Valuation</p>
             <p className="text-[40px] font-display font-bold text-white mb-6">
                {data ? formatCurrency(data.totalValue) : '$0.0M'}
             </p>
          </div>

          {/* Card 2 */}
          <div className="bg-[#050505] border border-[#222225] rounded-[24px] p-8">
             <div className="w-8 h-8 rounded-full bg-gray-800 flex justify-center items-center mb-6">
                 <svg className="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 3v18h18"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/></svg>
             </div>
             <p className="text-[11px] font-medium text-gray-400 mb-2">Leased Assets</p>
             <p className="text-[40px] font-display font-bold text-white mb-8">
                {data ? data.leasedAssets : '0'}
             </p>
          </div>

          {/* Card 3 */}
          <div className="bg-[#050505] border border-[#222225] rounded-[24px] p-8">
             <div className="w-8 h-8 rounded-full bg-gray-800 flex justify-center items-center mb-6">
                 <svg className="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
             </div>
             <p className="text-[11px] font-medium text-gray-400 mb-2">Active Holdings</p>
             <p className="text-[40px] font-display font-bold text-white mb-6">
                0{data ? data.activeAssets : '0'}
             </p>
          </div>
        </div>

        {/* Managed Portfolio Row Cards */}
        <div className="mb-10">
            <div className="flex justify-between items-end mb-6">
                <h2 className="text-2xl font-display font-bold text-white flex items-center gap-2">Holdings Portfolio<span className="text-[#3b82f6]">.</span></h2>
            </div>

            <div className="space-y-4">
               {data?.portfolio?.map((prop: any, i: number) => (
                   <div key={prop.property_id} className="bg-[#050505] border border-[#222225] rounded-[24px] p-3 flex justify-between items-center cursor-pointer hover:bg-[#131315] hover:border-[#3b82f6]/30 transition-all group">
                       <div className="flex items-center gap-6">
                           <div className="w-[160px] h-[90px] rounded-[16px] overflow-hidden ml-1">
                               <img 
                                src={[`https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=400`, `https://images.unsplash.com/photo-1628611225249-6c3c7c689552?w=400`][i%2]} 
                                alt="" 
                                className="w-full h-full object-cover brightness-75 group-hover:brightness-100 transition-all duration-500 scale-100 group-hover:scale-105"
                               />
                           </div>
                           <div>
                               <h3 className="text-white text-lg font-bold mb-1">Washub Prop #{prop.property_id}</h3>
                               <p className="text-[12px] text-gray-400 font-medium">{prop.city_name} • {formatCurrency(prop.selling_price || prop.rent_price)}</p>
                           </div>
                       </div>
                       
                       <div className="flex items-center gap-16 mr-8">
                           <div className="text-center">
                               <p className="text-[9px] uppercase tracking-[0.2em] text-gray-500 font-bold mb-2">Status</p>
                               <span className="px-4 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-[0.2em] border border-[#3b82f6]/40 bg-[#3b82f6]/10 text-[#60a5fa]">
                                   {prop.status}
                               </span>
                           </div>
                           <button className="w-8 h-8 rounded-full border border-[#222225] flex items-center justify-center text-gray-400 group-hover:bg-[#222225] transition-colors">
                               <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                           </button>
                       </div>
                   </div>
               ))}
               {(!data || data.portfolio?.length === 0) && (
                   <div className="p-8 text-center text-gray-600 border border-[#222225] rounded-[24px] uppercase tracking-[0.2em] text-[10px] font-bold">No assets registered.</div>
               )}
            </div>
        </div>

      </div>

      <h2 className="lg:hidden absolute top-8 right-8 text-[#3b82f6] font-display font-bold tracking-wider text-xl z-30 uppercase cursor-pointer" onClick={() => navigate('/')}>Washub</h2>
      
      {/* Profile Modal Overlay */}
      {showProfile && (
         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm px-4">
             <div className="bg-[#0d0d0f] border border-[#222225] rounded-[24px] p-8 w-full max-w-md shadow-2xl relative">
                <button onClick={() => setShowProfile(false)} className="absolute top-6 right-6 text-gray-500 hover:text-white">✕</button>
                <h2 className="text-2xl font-display font-bold text-white mb-2">Account Settings</h2>
                <p className="text-[11px] text-[#3b82f6] uppercase tracking-widest font-bold mb-8">Washub Proprietor Network</p>
                
                {profileMessage && <div className="mb-4 text-[#3b82f6] text-sm font-bold">{profileMessage}</div>}
                
                <form onSubmit={handleUpdateProfile} className="space-y-5">
                   <div>
                      <label className="text-[9px] uppercase tracking-[0.2em] text-gray-400 font-bold ml-1 block mb-2">Display Name</label>
                      <input type="text" value={profileForm.name} onChange={e => setProfileForm({...profileForm, name: e.target.value})} className="w-full bg-[#050505] border border-[#222225] rounded-xl px-4 py-3 text-white text-sm focus:border-[#3b82f6] outline-none" required/>
                   </div>
                   <div>
                      <label className="text-[9px] uppercase tracking-[0.2em] text-gray-400 font-bold ml-1 block mb-2">Email Address</label>
                      <input type="email" value={profileForm.email} onChange={e => setProfileForm({...profileForm, email: e.target.value})} className="w-full bg-[#050505] border border-[#222225] rounded-xl px-4 py-3 text-white text-sm focus:border-[#3b82f6] outline-none" required/>
                   </div>
                   <div>
                      <label className="text-[9px] uppercase tracking-[0.2em] text-gray-400 font-bold ml-1 block mb-2">Contact Phone</label>
                      <input type="text" value={profileForm.phone} onChange={e => setProfileForm({...profileForm, phone: e.target.value})} className="w-full bg-[#050505] border border-[#222225] rounded-xl px-4 py-3 text-white text-sm focus:border-[#3b82f6] outline-none" required/>
                   </div>
                   <button type="submit" className="w-full bg-[#3b82f6] hover:bg-[#1d4ed8] text-white py-3.5 rounded-xl font-bold uppercase tracking-widest text-[11px] mt-4 transition-colors">
                      Save Changes
                   </button>
                </form>
             </div>
         </div>
      )}
    </div>
  );
}
