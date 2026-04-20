import React from "react";
import { motion } from "framer-motion";
import { IoCloseOutline } from "react-icons/io5";

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="bg-[#1a1a1a] rounded-[24px] w-full max-w-lg shadow-[0_20px_60px_rgba(0,0,0,0.8)] border border-white/10 overflow-hidden transform transition-all"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-[#20201f]">
          <h2 className="text-xl text-[#f5f5f5] font-semibold">{title}</h2>
          <button onClick={onClose} className="p-2 bg-[#2c2c2c] hover:bg-red-600/20 text-[#adaaaa] hover:text-red-400 rounded-full transition-all cursor-pointer">
            <IoCloseOutline size={24} />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </motion.div>
    </div>
  );
};

export default Modal;
