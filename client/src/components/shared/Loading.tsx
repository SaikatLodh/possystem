import React from 'react';
import { motion } from 'framer-motion';

const Loading: React.FC = () => {
  return (
    <div className="fixed inset-0 z-[9999] bg-[#0e0e0e] flex flex-col items-center justify-center">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-[#F6B100]/5 rounded-full blur-[100px] animate-pulse" />
      
      <div className="relative">
        {/* Outer Orbiting Ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-24 h-24 rounded-full border-t-2 border-r-2 border-transparent border-t-[#F6B100] border-r-[#F6B100]/30"
        />
        
        {/* Inner Pulsing Core */}
        <motion.div
          animate={{ scale: [0.8, 1, 0.8], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 m-auto w-12 h-12 bg-gradient-to-br from-[#F6B100] to-[#ffd16c] rounded-full shadow-[0_0_30px_rgba(246,177,0,0.3)] flex items-center justify-center"
        >
          <span className="text-[10px] font-black text-[#1a1a1a]">CC</span>
        </motion.div>
      </div>

      {/* Loading Text */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mt-8 text-center"
      >
        <h2 className="text-[#f5f5f5] text-sm font-bold tracking-[0.5em] uppercase mb-1">
          Preparing Excellence
        </h2>
        <div className="flex items-center justify-center gap-1">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{ 
                scale: [1, 1.5, 1],
                backgroundColor: ['#333', '#F6B100', '#333']
              }}
              transition={{ 
                duration: 1, 
                repeat: Infinity, 
                delay: i * 0.2 
              }}
              className="w-1 h-1 rounded-full"
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Loading;
