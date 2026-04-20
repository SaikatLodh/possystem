import React from "react";

const TableSkeleton = () => {
  return (
    <div className="w-[300px] bg-[#262626] p-4 rounded-lg animate-pulse">
      <div className="flex items-center justify-between px-1">
        <div className="h-6 bg-[#383838] rounded w-32"></div>
        <div className="h-6 bg-[#383838] rounded w-16"></div>
      </div>
      <div className="flex items-center justify-center mt-5 mb-8">
        <div className="h-[68px] w-[68px] bg-[#383838] rounded-full"></div>
      </div>
      <div className="h-4 bg-[#383838] rounded w-16"></div>
    </div>
  );
};

export default TableSkeleton;
