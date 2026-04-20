import React, { useState } from 'react';
import Modal from '../shared/Modal';
import { MdErrorOutline } from 'react-icons/md';

interface DeleteAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  registeredEmail: string;
  isPending: boolean;
}

const DeleteAccountModal: React.FC<DeleteAccountModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  registeredEmail,
  isPending,
}) => {
  const [typedEmail, setTypedEmail] = useState('');

  const handleConfirm = () => {
    if (typedEmail === registeredEmail) {
      onConfirm();
    }
  };

  const isMatch = typedEmail === registeredEmail;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Delete Account">
      <div className="flex flex-col gap-6">
        <div className="flex items-start gap-4 p-4 bg-red-500/10 rounded-2xl border border-red-500/20">
          <div className="p-2 bg-red-500/20 rounded-xl text-red-500">
            <MdErrorOutline size={24} />
          </div>
          <div>
            <h4 className="text-red-500 font-bold mb-1">Irreversible Action</h4>
            <p className="text-[#adaaaa] text-sm leading-relaxed">
              Deleting your account will permanently remove all your data, including food items, tables, and settings. This cannot be undone.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <p className="text-[#f5f5f5] text-sm font-medium">
            To confirm, please type your email: <span className="text-[#F6B100] font-bold select-none">{registeredEmail}</span>
          </p>
          
          <input
            type="email"
            value={typedEmail}
            onChange={(e) => setTypedEmail(e.target.value)}
            placeholder="Enter your email to confirm"
            className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-[#f5f5f5] placeholder:text-[#4a4a4a] outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50 transition-all"
            autoFocus
          />
        </div>

        <div className="flex gap-3 pt-2">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-4 bg-white/5 hover:bg-white/10 text-[#adaaaa] font-bold rounded-2xl transition-all cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={!isMatch || isPending}
            className="flex-[2] px-6 py-4 bg-red-600 hover:bg-red-700 disabled:bg-gray-800 disabled:text-[#4a4a4a] text-white font-bold rounded-2xl transition-all cursor-pointer shadow-lg shadow-red-900/20 disabled:shadow-none"
          >
            {isPending ? 'Processing...' : 'Delete Permanently'}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteAccountModal;
