import React from "react";

const FoodCardSkeleton = () => {
  return (
    <div className="flex flex-col items-start bg-[#1a1a1a] rounded-[12px] p-4 animate-pulse">
      {/* Food Image Placeholder */}
      <div className="w-full h-40 bg-[#131313] rounded-[8px] mb-4 relative overflow-hidden">
        {/* Category Tag Placeholder */}
        <div className="absolute top-2 left-2 px-8 py-2 bg-[#2c2c2c]/60 rounded-[4px]" />
      </div>

      {/* Info Section */}
      <div className="w-full flex flex-col gap-3">
        {/* Name Placeholder */}
        <div className="h-6 bg-[#2c2c2c] rounded-md w-3/4" />
        
        <div className="flex items-center justify-between mt-2">
          {/* Price Placeholder */}
          <div className="h-7 bg-[#2c2c2c] rounded-md w-1/4" />

          {/* Action Buttons Placeholder */}
          <div className="flex items-center gap-2">
             <div className="w-8 h-8 bg-[#2c2c2c] rounded-md" />
             <div className="w-8 h-8 bg-[#2c2c2c] rounded-md" />
             <div className="w-9 h-8 bg-[#2c2c2c] rounded-md" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoodCardSkeleton;
