import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Bath, Bed, Square, ChevronLeft } from 'lucide-react';
import api from '../services/api';

export default function PropertyDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // If it's a dummy ID or not found in DB, we'll try to fetch, otherwise fallback to mock so UI doesn't crash
    const fetchProp = async () => {
      try {
        const res = await api.get(`/properties/${id}`);
        setProperty(res.data);
      } catch (err) {
        setProperty({ property_id: id, city_name: 'Zurich, Switzerland', selling_price: 8450000, bedrooms: 4, bathrooms: 3.5, size: 4200, type_name: 'Penthouse' });
      } finally {
        setLoading(false);
      }
    };
    fetchProp();
  }, [id]);

  if (loading) return <div className="min-h-screen bg-[#fafafa] flex items-center justify-center font-display text-arch-purple text-2xl">Loading...</div>;

  const formatCurrency = (val: number) => '$' + val.toLocaleString();

  return (
    <div className="min-h-screen bg-[#fafafa] font-sans text-gray-900 pb-20">
      {/* Top Navbar Header */}
      <nav className="w-full bg-white shadow-sm h-20 flex items-center px-8 lg:px-16 justify-between sticky top-0 z-50">
         <h2 className="text-[#9333ea] font-display font-bold text-xl cursor-pointer" onClick={() => navigate('/')}>Washub Estates</h2>
         <div className="hidden lg:flex gap-10 text-[12px] uppercase tracking-widest font-semibold text-gray-600">
            <span className="text-arch-purple border-b-2 border-arch-purple pb-1 cursor-pointer" onClick={() => navigate('/properties')}>Listings</span>
            <span className="cursor-pointer hover:text-arch-purple transition-colors">Curated</span>
            <span className="cursor-pointer hover:text-arch-purple transition-colors">Agents</span>
            <span className="cursor-pointer hover:text-arch-purple transition-colors">Contact</span>
         </div>
         <div className="flex items-center gap-6">
            <MapPin className="w-5 h-5 text-gray-500" />
            <button className="flex items-center gap-2 bg-[#f3f4f6] px-5 py-2 rounded-full font-bold text-xs uppercase tracking-widest text-[#4b5563] hover:bg-gray-200" onClick={() => navigate('/login')}>
              <div className="w-6 h-6 rounded-full bg-[#9333ea] text-white flex items-center justify-center -ml-2">P</div>
              Profile
            </button>
         </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 mt-10">
        <button onClick={() => navigate('/properties')} className="flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-arch-purple mb-6 transition-colors">
          <ChevronLeft className="w-4 h-4" /> Back to Collection
        </button>

        {/* Hero Image Block */}
        <div className="w-full h-[600px] rounded-[40px] overflow-hidden relative shadow-2xl mb-16 border border-gray-200">
           <img 
             src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600" 
             alt="Property View" 
             className="w-full h-full object-cover brightness-[0.7]"
           />
           {/* Dark gradient overlay matching mockup */}
           <div className="absolute inset-x-0 bottom-0 h-[300px] bg-gradient-to-t from-black/80 to-transparent"></div>
           
           <div className="absolute bottom-10 left-10 right-10 flex flex-col md:flex-row justify-between items-end">
              <div className="text-white">
                <div className="flex gap-3 mb-4">
                  <span className="bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border border-white/30">
                    {property?.type_name || 'Penthouse'}
                  </span>
                  <span className="bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border border-white/30">
                    {property?.city_name}
                  </span>
                </div>
                <h1 className="text-5xl lg:text-7xl font-display font-bold tracking-tight mb-4 drop-shadow-lg">The Obsidian Loft</h1>
                <div className="flex gap-8 text-sm font-semibold tracking-wide">
                  <div className="flex items-center gap-2"><Bed className="w-5 h-5"/> {property?.bedrooms} Beds</div>
                  <div className="flex items-center gap-2"><Bath className="w-5 h-5"/> {property?.bathrooms} Baths</div>
                  <div className="flex items-center gap-2"><Square className="w-5 h-5"/> {property?.size} sqft</div>
                </div>
              </div>
              
              <div className="bg-[#1c1c1e]/90 backdrop-blur-xl p-8 rounded-[24px] border border-white/10 mt-6 md:mt-0 min-w-[320px] shadow-2xl">
                 <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Market Price</p>
                 <p className="text-4xl font-display font-bold text-white mb-6">{formatCurrency(property?.selling_price || property?.rent_price || 0)}</p>
                 <button className="w-full bg-[#7e22ce] hover:bg-[#6b21a8] text-white py-4 rounded-xl font-bold uppercase tracking-widest text-xs transition-colors">
                    Inquire Now
                 </button>
              </div>
           </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Left Column: Narrative & Amenities */}
          <div className="lg:col-span-8">
            <h2 className="text-2xl font-display font-bold mb-6 text-black">Architectural Narrative</h2>
            <div className="prose prose-gray max-w-none text-gray-600 leading-loose font-medium mb-16 space-y-6">
              <p>
                Perched above the crystalline waters of Lake Zurich, The Obsidian Loft is a masterclass in structural transparency. Designed by the visionary Aether Collective, this residence utilizes monolithic basalt planes juxtaposed against floor-to-ceiling smart-glass, creating a seamless dialogue between the interior luxury and the Swiss alpine landscape.
              </p>
              <p>
                The double-height living space features a custom-engineered floating staircase and a central fireplace crafted from hand-hammered bronze, anchoring the ethereal openness of the gallery-style floor plan.
              </p>
            </div>

            <h2 className="text-2xl font-display font-bold mb-8 text-black">Curated Amenities</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
               {[
                 {name: 'Infinity Pool', icon: '🏊'},
                 {name: 'Private Cellar', icon: '🍷'},
                 {name: '6-Car Gallery', icon: '🚘'},
                 {name: 'Wellness Spa', icon: '💆'},
                 {name: 'Climate Ctrl', icon: '🌡️'},
                 {name: 'Cinema Room', icon: '🎬'},
                 {name: 'Solar Array', icon: '⚡'},
                 {name: 'Smart Security', icon: '🛡️'}
               ].map((am, i) => (
                 <div key={i} className="bg-white border border-gray-100 rounded-2xl p-6 flex flex-col items-center justify-center text-center shadow-sm hover:shadow-md transition-shadow">
                   <div className="text-2xl mb-3 text-arch-purple">{am.icon}</div>
                   <p className="text-[10px] font-bold uppercase tracking-wide text-gray-600">{am.name}</p>
                 </div>
               ))}
            </div>

            <h2 className="text-2xl font-display font-bold mb-8 text-black">Client Testimonials</h2>
            <div className="space-y-6 mb-16">
               <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm">
                 <div className="flex items-center gap-4 mb-4">
                   <div className="w-12 h-12 bg-gray-200 rounded-full overflow-hidden">
                     <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100" className="w-full h-full object-cover" alt=""/>
                   </div>
                   <div>
                     <p className="font-bold text-sm text-gray-900">Julian Vane</p>
                     <p className="text-[9px] uppercase tracking-widest text-gray-400 font-bold">Global Collector</p>
                   </div>
                 </div>
                 <p className="text-gray-600 italic leading-relaxed text-sm">"The level of detail in the Obsidian Loft is unparalleled. It's not just a home; it's a piece of habitable art that redefines modern living."</p>
               </div>

               <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm">
                 <div className="flex items-center gap-4 mb-4">
                   <div className="w-12 h-12 bg-gray-200 rounded-full overflow-hidden">
                     <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100" className="w-full h-full object-cover" alt=""/>
                   </div>
                   <div>
                     <p className="font-bold text-sm text-gray-900">Elena Rossi</p>
                     <p className="text-[9px] uppercase tracking-widest text-gray-400 font-bold">Design Critic</p>
                   </div>
                 </div>
                 <p className="text-gray-600 italic leading-relaxed text-sm">"The integration of light and material honesty here is what every luxury development should aspire to. Simply breathtaking."</p>
               </div>
            </div>
          </div>

          {/* Right Column: Agent Form & Map */}
          <div className="lg:col-span-4 space-y-8">
             <div className="bg-white border border-gray-100 rounded-[32px] p-8 shadow-xl shadow-gray-200/50">
               <div className="flex flex-col items-center border-b border-gray-100 pb-8 mb-8">
                 <div className="w-20 h-20 rounded-full bg-gray-200 mb-4 overflow-hidden border-4 border-white shadow-lg">
                    <img src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200" className="w-full h-full object-cover" alt="Agent"/>
                 </div>
                 <h3 className="font-display font-bold text-xl text-gray-900">Marcus Thorne</h3>
                 <p className="text-[10px] uppercase tracking-widest font-bold text-arch-purple">Principal Agent</p>
               </div>

               <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); alert("Inquiry sent successfully to Agent!"); }}>
                 <div>
                   <label className="text-[9px] uppercase tracking-widest font-bold text-gray-500 mb-2 block ml-1">Your Name</label>
                   <input type="text" placeholder="John Doe" className="w-full bg-[#f3f4f6] border-transparent rounded-xl px-4 py-3.5 text-sm focus:border-arch-purple focus:ring-1 focus:ring-arch-purple transition-all outline-none" required/>
                 </div>
                 <div>
                   <label className="text-[9px] uppercase tracking-widest font-bold text-gray-500 mb-2 block ml-1">Email Address</label>
                   <input type="email" placeholder="john@example.com" className="w-full bg-[#f3f4f6] border-transparent rounded-xl px-4 py-3.5 text-sm focus:border-arch-purple focus:ring-1 focus:ring-arch-purple transition-all outline-none" required/>
                 </div>
                 <div>
                   <label className="text-[9px] uppercase tracking-widest font-bold text-gray-500 mb-2 block ml-1">Message</label>
                   <textarea placeholder="I am interested in scheduling a private viewing..." rows={4} className="w-full bg-[#f3f4f6] border-transparent rounded-xl px-4 py-3 text-sm focus:border-arch-purple focus:ring-1 focus:ring-arch-purple transition-all outline-none resize-none" required></textarea>
                 </div>
                 <button type="submit" className="w-full bg-[#3b0764] hover:bg-[#2e054e] text-white py-4 rounded-xl font-bold uppercase tracking-widest text-xs transition-colors mt-2 shadow-lg shadow-purple-900/20">
                    Send Inquiry
                 </button>
               </form>
             </div>

             {/* Neighborhood Map card */}
             <div className="w-full h-[240px] bg-gray-900 rounded-[32px] overflow-hidden relative shadow-xl border border-gray-800">
                <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=800" className="w-full h-full object-cover opacity-60 mix-blend-overlay" alt="Map"/>
                <div className="absolute inset-0 bg-[#3b0764] mix-blend-color"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                   <button className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-6 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-white/20 transition-all">
                     Explore Neighborhood
                   </button>
                </div>
             </div>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="w-full border-t border-gray-200 bg-white mt-10">
          <div className="max-w-7xl mx-auto px-8 lg:px-16 py-12 grid grid-cols-1 md:grid-cols-4 gap-12">
             <div>
                 <h2 className="text-gray-900 font-display font-bold text-sm mb-4">Washub Estates</h2>
                 <p className="text-gray-500 text-[10px] leading-relaxed max-w-[200px]">Curating the world's most exceptional residential architectures for the discerning collector.</p>
             </div>
             <div>
                 <h3 className="text-gray-900 font-bold text-[10px] tracking-widest uppercase mb-4">Discovery</h3>
                 <div className="space-y-3 flex flex-col">
                   <span className="text-gray-500 hover:text-arch-purple text-[10px] transition-colors cursor-pointer">Global Listings</span>
                   <span className="text-gray-500 hover:text-arch-purple text-[10px] transition-colors cursor-pointer">Architectural Awards</span>
                   <span className="text-gray-500 hover:text-arch-purple text-[10px] transition-colors cursor-pointer">Agent Directory</span>
                 </div>
             </div>
             <div>
                 <h3 className="text-gray-900 font-bold text-[10px] tracking-widest uppercase mb-4">Legal</h3>
                 <div className="space-y-3 flex flex-col">
                   <span className="text-gray-500 hover:text-arch-purple text-[10px] transition-colors cursor-pointer">Privacy Policy</span>
                   <span className="text-gray-500 hover:text-arch-purple text-[10px] transition-colors cursor-pointer">Terms of Service</span>
                   <span className="text-gray-500 hover:text-arch-purple text-[10px] transition-colors cursor-pointer">Cookie Policy</span>
                 </div>
             </div>
             <div>
                 <h3 className="text-gray-900 font-bold text-[10px] tracking-widest uppercase mb-4">Journal</h3>
                 <p className="text-gray-500 text-[10px] leading-relaxed mb-4">Subscribe to our monthly architectural digest.</p>
                 <div className="flex bg-[#f3f4f6] rounded-full overflow-hidden p-1">
                   <input type="email" placeholder="Email" className="bg-transparent border-none text-xs px-4 py-2 w-full outline-none text-gray-700"/>
                   <button className="bg-[#3b0764] w-8 h-8 rounded-full flex items-center justify-center text-white shrink-0">→</button>
                 </div>
             </div>
          </div>
          <div className="w-full border-t border-gray-100 py-6 text-center text-[9px] text-gray-400 tracking-widest uppercase font-medium">
             © 2026 Washub Estates Editorial. All rights reserved.
          </div>
      </footer>
    </div>
  );
}
