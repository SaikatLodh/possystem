import React from 'react';
import Modal from '../shared/Modal';
import { MdLogout } from 'react-icons/md';

interface LogoutConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const LogoutConfirmModal: React.FC<LogoutConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Confirm Logout">
      <div className="flex flex-col gap-6">
        <div className="flex items-start gap-4 p-4 bg-[#F6B100]/10 rounded-2xl border border-[#F6B100]/20">
          <div className="p-2 bg-[#F6B100]/20 rounded-xl text-[#F6B100]">
            <MdLogout size={24} />
          </div>
          <div>
            <h4 className="text-[#F6B100] font-bold mb-1">Logging Out?</h4>
            <p className="text-[#adaaaa] text-sm leading-relaxed">
              Are you sure you want to log out of your account? You'll need to sign back in to access your dashboard.
            </p>
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-4 bg-white/5 hover:bg-white/10 text-[#adaaaa] font-bold rounded-2xl transition-all cursor-pointer"
          >
            Stay Logged In
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-6 py-4 bg-[#F6B100] hover:bg-[#d99c00] text-[#1a1a1a] font-bold rounded-2xl transition-all cursor-pointer shadow-lg shadow-[#F6B100]/10"
          >
            Logout
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default LogoutConfirmModal;
