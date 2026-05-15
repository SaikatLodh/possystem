import { IoWarningOutline } from "react-icons/io5";
import Modal from "../shared/Modal";

interface DeleteWaiterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isPending: boolean;
  waiterName?: string;
}

const DeleteWaiterModal = ({
  isOpen,
  onClose,
  onConfirm,
  isPending,
  waiterName,
}: DeleteWaiterModalProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Delete Waiter">
      <div className="flex flex-col items-center text-center gap-4 py-2">
        <div className="bg-red-500/10 p-4 rounded-full text-red-500 mb-2">
          <IoWarningOutline size={48} />
        </div>
        
        <div className="space-y-2">
          <h2 className="text-[#f5f5f5] text-xl font-bold">Are you sure?</h2>
          <p className="text-[#ababab] text-sm leading-relaxed max-w-xs">
            You are about to delete <span className="text-[#f5f5f5] font-semibold">{waiterName || "this waiter"}</span>. 
            This action will disable their account access.
          </p>
        </div>

        <div className="flex w-full gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 rounded-xl border border-white/10 text-[#adaaaa] hover:bg-white/5 transition-colors font-medium cursor-pointer"
          >
            No, Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isPending}
            className="flex-1 px-6 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold shadow-[0_0_20px_rgba(220,38,38,0.2)] transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isPending ? "Deleting..." : "Yes, Delete"}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteWaiterModal;
