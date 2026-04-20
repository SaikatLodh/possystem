import React from 'react';
import { motion } from 'framer-motion';
import { IoRefreshOutline, IoHomeOutline } from 'react-icons/io5';

const ServiceUnavailable: React.FC = () => {

  return (
    <div className="min-h-screen bg-[#0e0e0e] flex items-center justify-center px-4 overflow-hidden relative">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#F6B100]/5 rounded-full blur-[100px]" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-[#F6B100]/5 rounded-full blur-[100px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-5xl w-full flex flex-col md:flex-row items-center gap-12 relative z-10"
      >
        {/* Illustration Section */}
        <motion.div 
          className="flex-1 relative group"
          animate={{ 
            y: [0, -10, 0],
          }}
          transition={{ 
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-[#0e0e0e] via-transparent to-transparent z-10" />
          <div className="relative rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/5 group-hover:border-white/10 transition-all duration-500">
            <img 
              src="/service-unavailable.png" 
              alt="Service Unavailable" 
              className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-700"
              onError={(e) => {
                // Fallback if image fails to load
                (e.target as HTMLImageElement).src = '/assets/food.png';
              }}
            />
            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-all duration-500" />
          </div>
          
          {/* Accent Glow */}
          <div className="absolute -inset-4 bg-[#F6B100]/2 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </motion.div>

        {/* Content Section */}
        <div className="flex-1 text-center md:text-left">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <span className="text-[#F6B100] font-black tracking-[0.3em] uppercase text-sm mb-4 block">
              Error Code: 503
            </span>
            <h1 className="text-[#f5f5f5] text-5xl md:text-6xl font-black mb-6 leading-tight">
              Service <br/> 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F6B100] to-[#ffd16c]">
                Unavailable
              </span>
            </h1>
            <p className="text-[#adaaaa] text-lg mb-10 leading-relaxed max-w-md mx-auto md:mx-0">
              Our culinary servers are currently undergoing maintenance to serve you better. We'll be back in the kitchen shortly.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center md:justify-start">
              <button 
                onClick={() => window.location.reload()}
                className="w-full sm:w-auto px-8 py-4 bg-[#F6B100] hover:bg-[#fdc003] text-[#1a1a1a] font-black rounded-2xl transition-all active:scale-95 flex items-center justify-center gap-3 shadow-[0_10px_20px_rgba(246,177,0,0.2)] cursor-pointer"
              >
                <IoRefreshOutline size={20} />
                REFRESH PAGE
              </button>
              
              <button 
                onClick={() => window.location.href = '/'}
                className="w-full sm:w-auto px-8 py-4 bg-[#1a1a1a] hover:bg-[#262626] text-[#f5f5f5] font-bold rounded-2xl border border-white/10 hover:border-white/20 transition-all active:scale-95 flex items-center justify-center gap-3 cursor-pointer"
              >
                <IoHomeOutline size={20} />
                BACK TO HOME
              </button>
            </div>
          </motion.div>

          {/* Social / Contact Links (Optional placeholder style) */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-12 flex items-center gap-6 justify-center md:justify-start"
          >
            <div className="h-px w-12 bg-white/10" />
            <p className="text-[#333] text-sm uppercase tracking-widest font-bold">
              Culinary Conductor POS
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default ServiceUnavailable;
