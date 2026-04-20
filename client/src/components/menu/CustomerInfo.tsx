import { useState } from "react";
import type { User } from "../../interface";
import { formatDate } from "../../utils/features";

const CustomerInfo = ({ user, table }: { user: User | null, table: string | null }) => {
  const [dateTime, setDateTime] = useState(new Date());
  return <>
    <div className="flex items-center justify-between px-4 py-3">
      <div className="flex flex-col items-start">
        <h1 className="text-md text-[#f5f5f5] font-semibold tracking-wide">
          {user?.fullname || "Customer Name"}
        </h1>
        <p className="text-xs text-[#ababab] font-medium mt-1">
          Table : {table || "N/A"} / Dine in
        </p>
        <p className="text-xs text-[#ababab] font-medium mt-2">
          {formatDate(dateTime)}
        </p>
      </div>
      <div className='w-12 h-12 rounded-full overflow-hidden border-4 border-[#F6B100]/20 shadow-2xl transition-transform duration-500 group-hover:scale-105'>
        <img
          src={user?.profilePicture || "/assets/icon-7797704_640.png"}
          alt="Profile"
          className='w-full h-full object-cover'
        />
      </div>
    </div>
  </>;
};

export default CustomerInfo;
