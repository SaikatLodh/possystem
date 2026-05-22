import { FaUserTie, FaEnvelope, FaPhone, FaCalendarAlt, FaTrashAlt } from "react-icons/fa";
import type { User } from "../../interface";


const WaiterList = ({
  waiters,
  onDelete
}: {
  waiters: User[],
  onDelete: (waiter: User) => void
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {waiters.map((waiter) => (
        <div
          key={waiter.id}
          className="bg-[#262626] rounded-2xl p-6 border border-white/5 hover:border-[#F6B100]/30 transition-all group relative overflow-hidden"
        >
          {/* Decorative background element */}
          <div className="absolute -right-4 -top-4 bg-[#F6B100]/5 w-24 h-24 rounded-full blur-2xl group-hover:bg-[#F6B100]/10 transition-colors" />

          <div className="flex items-start gap-4">
            <div className="bg-[#343434] p-4 rounded-2xl text-[#F6B100] group-hover:scale-110 transition-transform shadow-lg">
              <FaUserTie size={24} />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-[#f5f5f5] text-lg font-bold truncate capitalize mb-1">
                {waiter.fullname}
              </h3>
              <div className="flex items-center gap-2 text-[#F6B100] text-xs font-semibold bg-[#F6B100]/10 w-fit px-2 py-0.5 rounded-md uppercase tracking-wider">
                {waiter.role}
              </div>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            <div className="flex items-center gap-3 text-[#ababab] group/item">
              <div className="p-2 bg-[#131313] rounded-lg group-hover/item:text-[#F6B100] transition-colors">
                <FaEnvelope size={14} />
              </div>
              <p className="text-sm truncate">{waiter.email}</p>
            </div>
            <div className="flex items-center gap-3 text-[#ababab] group/item">
              <div className="p-2 bg-[#131313] rounded-lg group-hover/item:text-[#F6B100] transition-colors">
                <FaPhone size={14} />
              </div>
              <p className="text-sm">{waiter.number}</p>
            </div>
            <div className="flex items-center gap-3 text-[#ababab] group/item">
              <div className="p-2 bg-[#131313] rounded-lg group-hover/item:text-[#F6B100] transition-colors">
                <FaCalendarAlt size={14} />
              </div>
              <p className="text-sm">
                Joined: {new Date(waiter.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "2-digit",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-white/5 flex justify-between items-center">
            <div className="flex items-center gap-3">

              <button
                onClick={() => onDelete(waiter)}
                className="text-red-500 hover:text-red-400 p-1 transition-colors cursor-pointer"
                title="Delete Waiter"
              >
                <FaTrashAlt size={14} />
              </button>
            </div>
            <span className="text-[#444] text-[10px] font-mono">
              ID: {waiter.id.slice(0, 8)}...
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default WaiterList;
