import { BedDouble, Bath, Square, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function PropertyCard({ property }: { property: any }) {
  const price = property.selling_price 
    ? `₹${(property.selling_price / 100000).toFixed(2)} Lac`
    : `₹${property.rent_price}/mo`;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 50, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, type: "spring", bounce: 0.4 }}
      viewport={{ once: true, margin: "-50px" }}
      whileHover={{ y: -8, transition: { duration: 0.2 } }}
      className="glass-card group flex flex-col hover:border-primary-500/50 hover:shadow-[0_0_30px_rgba(14,165,233,0.3)] transition-all"
    >
      <div className="relative h-64 overflow-hidden">
        <img 
          src={property.image_url || 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80'} 
          alt="Property" 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-4 left-4 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full text-sm font-medium border border-white/10 capitalize">
          {property.status}
        </div>
        <div className="absolute top-4 right-4 bg-primary-500/80 backdrop-blur-md px-3 py-1 rounded-full text-sm font-medium border border-white/10">
          {property.type_name}
        </div>
      </div>
      
      <div className="p-6 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-2xl font-bold text-white mb-2">{price}</h3>
            <p className="flex items-center text-white/70 gap-1 text-sm">
              <MapPin className="w-4 h-4" />
              {property.city_name}
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-2 py-4 border-y border-white/10 mb-6">
          <div className="flex flex-col items-center gap-1">
            <BedDouble className="w-5 h-5 text-primary-400" />
            <span className="text-sm font-medium">{property.bedrooms} Beds</span>
          </div>
          <div className="flex flex-col items-center gap-1 border-x border-white/10">
            <Bath className="w-5 h-5 text-primary-400" />
            <span className="text-sm font-medium">{property.bathrooms} Baths</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <Square className="w-5 h-5 text-primary-400" />
            <span className="text-sm font-medium">{property.size} sqft</span>
          </div>
        </div>

        <Link to={`/properties/${property.property_id}`} className="mt-auto block w-full text-center glass-button py-3">
          View Details
        </Link>
      </div>
    </motion.div>
  );
}
