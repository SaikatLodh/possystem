import { useState, useRef, useEffect } from "react";
import {
  FaCheckDouble,
  FaCircle,
  FaLongArrowAltRight,
  FaChevronDown,
  FaSpinner,
} from "react-icons/fa";
import { MdOutlineCancel } from "react-icons/md";
import type { Booking } from "../../interface";
import { formatDateAndTime, getAvatarName } from "../../utils/features";
import { Link } from "react-router-dom";
import { useAppSelector } from "../../store/hook";
import { useQlMutation } from "../../graphql/globalRequest";
import { toggleTableStatus } from "../../graphql/query/table";
import { useQueryClient } from "@tanstack/react-query";
import { BOOKINGS, USER_BOOKINGS } from "../../tanstackKeys";

const statusOptions = [
  {
    value: "confirmed",
    label: "Confirmed",
    color: "text-green-400",
    bg: "bg-[#1a3a2a] hover:bg-[#1e4a33]",
    dot: "bg-green-400",
  },
  {
    value: "pending",
    label: "Pending",
    color: "text-yellow-400",
    bg: "bg-[#3a3010] hover:bg-[#4a3d10]",
    dot: "bg-yellow-400",
  },
  {
    value: "not confirmed",
    label: "Not Confirmed",
    color: "text-red-400",
    bg: "bg-[#3a1515] hover:bg-[#4a1a1a]",
    dot: "bg-red-400",
  },
];

const StatusBadge = ({ status }: { status: string }) => {
  if (status === "confirmed") {
    return (
      <span className="flex items-center gap-1.5 text-green-400 bg-[#1e3a28] px-3 py-1 rounded-full text-sm font-medium">
        <FaCheckDouble className="text-xs" />
        Confirmed
      </span>
    );
  }
  if (status === "pending") {
    return (
      <span className="flex items-center gap-1.5 text-yellow-400 bg-[#3a3010] px-3 py-1 rounded-full text-sm font-medium">
        <FaCircle className="text-xs" />
        Pending
      </span>
    );
  }
  return (
    <span className="flex items-center gap-1.5 text-red-400 bg-[#3a1515] px-3 py-1 rounded-full text-sm font-medium">
      <MdOutlineCancel className="text-xs" />
      Not Confirmed
    </span>
  );
};

const OrderCard = ({ order }: { order: Booking }) => {
  const totalPrice =
    order.foods?.reduce((acc, food) => acc + food.price, 0) || 0;
  const { user } = useAppSelector((state) => state.auth);
  const isStaff = user?.role === "admin" || user?.role === "waiter";

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [localStatus, setLocalStatus] = useState(order.confirmStatus);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  const { mutate: toggleStatus, isPending } = useQlMutation(toggleTableStatus);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleStatusChange = (newStatus: string) => {
    setDropdownOpen(false);
    if (newStatus === localStatus) return;

    // Map status → toggle (backend toggles available ↔ unavailable and sets booking confirmStatus)
    toggleStatus(
      {
        toggleTableStatusId: order.table?.id,
        waiterId: user?.id,
        bookingId: order.id,
      },
      {
        onSuccess: (data) => {
          if ((data as any)?.toggleTableStatus?.status === 200) {
            setLocalStatus(newStatus as any);
            queryClient.invalidateQueries({ queryKey: [BOOKINGS] });
            queryClient.invalidateQueries({ queryKey: [USER_BOOKINGS] });
          }
        },
      },
    );
  };

  const currentStatusOption =
    statusOptions.find((s) => s.value === localStatus) || statusOptions[1];

  return (
    <>
      <div className="w-full bg-[#262626] p-4 rounded-xl mb-4 border border-[#2e2e2e] hover:border-[#404040] transition-all duration-200 shadow-lg">
        {/* Header Row */}
        <div className="flex items-start gap-4">
          {/* Avatar */}
          <div className="bg-[#f6b100] min-w-[46px] h-[46px] flex items-center justify-center text-black text-base font-bold rounded-lg shrink-0">
            {getAvatarName(order.user.fullname)}
          </div>

          {/* Info */}
          <div className="flex items-start justify-between w-full gap-2">
            <div className="flex flex-col gap-0.5">
              <h2 className="text-[#f5f5f5] text-base font-semibold tracking-wide leading-tight">
                {order.user.fullname}
              </h2>
              <p className="text-[#6e6e6e] text-xs">
                #{formatDateAndTime(new Date(order.createdAt))} · Dine in
              </p>
              <p className="text-[#6e6e6e] text-xs flex items-center gap-1 mt-0.5">
                Table <FaLongArrowAltRight className="text-[#6e6e6e]" />
                <span className="text-[#ababab] font-medium">
                  {order.table?.tableNumber}
                </span>
              </p>
            </div>

            {/* Status area */}
            <div className="flex flex-col items-end gap-2 shrink-0">
              {isStaff ? (
                /* ---- Staff: dropdown status changer ---- */
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setDropdownOpen((v) => !v)}
                    disabled={isPending}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-150 border border-transparent hover:border-[#404040] ${currentStatusOption.color} ${currentStatusOption.bg} cursor-pointer`}
                  >
                    {isPending ? (
                      <FaSpinner className="animate-spin text-xs" />
                    ) : (
                      <span
                        className={`w-2 h-2 rounded-full ${currentStatusOption.dot} shrink-0`}
                      />
                    )}
                    <span className="capitalize">
                      {currentStatusOption.label}
                    </span>
                    {
                      user?.role === "waiter" && (
                        <FaChevronDown
                          className={`text-xs transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`}
                        />
                      )
                    }
                  </button>

                  {/* Dropdown */}

                  {user?.role === "waiter" && dropdownOpen && (
                    <div className="absolute right-0 mt-1 w-44 bg-[#1f1f1f] border border-[#383838] rounded-xl shadow-2xl z-50 overflow-hidden animate-fade-in">
                      {statusOptions.map((opt) => (
                        <button
                          key={opt.value}
                          onClick={() => handleStatusChange(opt.value)}
                          className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-sm font-medium transition-colors duration-100 cursor-pointer ${opt.color} ${opt.bg} ${localStatus === opt.value ? "opacity-100 font-bold" : "opacity-80"}`}
                        >
                          <span
                            className={`w-2 h-2 rounded-full ${opt.dot} shrink-0`}
                          />
                          {opt.label}
                          {localStatus === opt.value && (
                            <FaCheckDouble className="ml-auto text-xs" />
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                /* ---- Customer: read-only badge ---- */
                <StatusBadge status={localStatus} />
              )}

              {/* Sub status line */}
              <p className="text-[#6e6e6e] text-xs">
                {localStatus === "confirmed" ? (
                  <span className="flex items-center gap-1 text-green-500">
                    <FaCircle className="text-[8px]" /> Ready to serve
                  </span>
                ) : localStatus === "pending" ? (
                  <span className="flex items-center gap-1 text-yellow-500">
                    <FaCircle className="text-[8px]" /> Preparing your order
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-red-500">
                    <FaCircle className="text-[8px]" /> Awaiting confirmation
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-4 flex items-center justify-between text-[#6e6e6e] text-sm">
          {totalPrice.toFixed(2) === "0.00" ? (
            <span className="text-[#ababab] text-xs font-medium">
              Wait for confirmation
            </span>
          ) : (
            <span>
              {order.foods?.length || 0} item
              {(order.foods?.length || 0) !== 1 ? "s" : ""}
            </span>
          )}

          {!isStaff && order.paymentStatus !== "paid" && (
            <Link
              to={`${localStatus === "confirmed" ? `/menu?table=${order.table?.tableNumber}&tableId=${order.table?.id}` : "/orders"}`}
              className="text-[#f6b100] text-xs font-medium hover:underline"
            >
              View order →
            </Link>
          )}

          {!isStaff && order.paymentStatus === "paid" && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="text-[#f6b100] text-xs font-medium hover:underline cursor-pointer"
            >
              Order Detail →
            </button>
          )}

          {isStaff && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="text-[#f6b100] text-xs font-medium hover:underline cursor-pointer"
            >
              Order Detail →
            </button>
          )}
        </div>

        {totalPrice.toFixed(2) !== "0.00" && (
          <>
            <hr className="w-full mt-3 border-t border-[#2e2e2e]" />
            <div className="flex items-center justify-between mt-3">
              <span className="text-[#f5f5f5] text-sm font-semibold">
                Total
              </span>
              <span className="text-[#f6b100] text-sm font-bold">
                ₹{totalPrice.toFixed(2)}
              </span>
            </div>
          </>
        )}
      </div>

      {/* Order Details Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#1f1f1f] w-full max-w-md rounded-2xl shadow-2xl border border-[#383838] overflow-hidden flex flex-col max-h-[80vh]">
            {/* Modal Header */}
            <div className="p-4 border-b border-[#383838] flex items-center justify-between bg-[#262626]">
              <h2 className="text-[#f5f5f5] text-lg font-bold tracking-wide">Order Details</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-[#ababab] hover:text-white transition-colors cursor-pointer"
              >
                <MdOutlineCancel className="text-2xl" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 overflow-y-auto flex-1 flex flex-col gap-4">
              {/* Order Info */}
              <div className="flex flex-col gap-2 bg-[#2a2a2a] p-3 rounded-xl border border-[#383838]">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-[#ababab]">Customer:</span>
                  <span className="text-[#f5f5f5] font-semibold">{order.user.fullname}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-[#ababab]">Table Number:</span>
                  <span className="text-[#f5f5f5] font-semibold">{order.table?.tableNumber || "N/A"}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-[#ababab]">Status:</span>
                  <StatusBadge status={localStatus} />
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-[#ababab]">Payment:</span>
                  <span className={`font-semibold capitalize ${order.paymentStatus === 'paid' ? 'text-green-400' : 'text-yellow-400'}`}>
                    {order.paymentStatus}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-[#ababab]">Date:</span>
                  <span className="text-[#f5f5f5]">{formatDateAndTime(new Date(order.createdAt))}</span>
                </div>
              </div>

              {/* Items */}
              <div>
                <h3 className="text-[#f5f5f5] text-md font-semibold mb-2">Items ({order.foods?.length || 0})</h3>
                <div className="flex flex-col gap-2">
                  {order.foods?.map((food, idx) => (
                    <div key={idx} className="flex justify-between items-center bg-[#2a2a2a] p-3 rounded-xl border border-[#383838]">
                      <div className="flex items-center gap-3">
                        <img src={food.image || "https://placehold.co/100"} alt={food.name} className="w-10 h-10 rounded-md object-cover" />
                        <div>
                          <p className="text-[#f5f5f5] text-sm font-medium">{food.name}</p>
                          <p className="text-[#ababab] text-xs capitalize">{food.category}</p>
                        </div>
                      </div>
                      <span className="text-[#f6b100] font-semibold text-sm">₹{food.price.toFixed(2)}</span>
                    </div>
                  ))}
                  {(!order.foods || order.foods.length === 0) && (
                    <p className="text-[#ababab] text-sm italic">No items found.</p>
                  )}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-[#383838] bg-[#262626] flex justify-between items-center">
              <span className="text-[#ababab] font-medium">Total Amount</span>
              <span className="text-[#f6b100] text-xl font-bold">₹{totalPrice.toFixed(2)}</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default OrderCard;

export const OrderCardSkeleton = () => {
  return (
    <div className="w-full bg-[#262626] p-4 rounded-xl mb-4 border border-[#2e2e2e] animate-pulse">
      <div className="flex items-center gap-4">
        <div className="bg-[#383838] w-[46px] h-[46px] rounded-lg shrink-0"></div>
        <div className="flex items-center justify-between w-full">
          <div className="flex flex-col items-start gap-2">
            <div className="h-4 bg-[#383838] rounded w-32"></div>
            <div className="h-3 bg-[#383838] rounded w-40"></div>
            <div className="h-3 bg-[#383838] rounded w-24"></div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <div className="h-7 bg-[#383838] rounded-full w-28"></div>
            <div className="h-3 bg-[#383838] rounded w-28"></div>
          </div>
        </div>
      </div>
      <div className="flex justify-between items-center mt-5">
        <div className="h-3 bg-[#383838] rounded w-20"></div>
        <div className="h-3 bg-[#383838] rounded w-14"></div>
      </div>
      <hr className="w-full mt-3 border-t border-[#2e2e2e]" />
      <div className="flex items-center justify-between mt-3">
        <div className="h-4 bg-[#383838] rounded w-12"></div>
        <div className="h-4 bg-[#383838] rounded w-20"></div>
      </div>
    </div>
  );
};
