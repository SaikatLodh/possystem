import { FaCheckDouble, FaCircle, FaLongArrowAltRight } from "react-icons/fa";
import { getAvatarName } from "../../utils/features";
import type { Payment } from "../../interface";

const OrderList = ({ order }: { order: Payment }) => {
  return (
    <>
      <div className="flex items-center gap-5 mb-3">
        <button className="bg-[#f6b100] p-3 text-xl font-bold rounded-lg">
          {getAvatarName(order.user.fullname)}
        </button>
        <div className="flex items-center justify-between w-[100%]">
          <div className="flex flex-col items-start gap-1">
            <h1 className="text-[#f5f5f5] text-lg font-semibold tracking-wide">
              {order.user.fullname}
            </h1>
            {/* <p className="text-[#ababab] text-sm">{order.items.length} Items</p> */}
          </div>

          <h1 className="text-[#f6b100] font-semibold border border-[#f6b100] rounded-lg p-1">
            Table <FaLongArrowAltRight className="text-[#ababab] ml-2 inline" />{" "}
            {order.booking.table.tableNumber}
          </h1>

          <div className="flex flex-col items-end gap-2">
            {order.paymentStatus === "paid" ? (
              <>
                <p className="text-green-600 bg-[#2e4a40] px-2 py-1 rounded-lg">
                  <FaCheckDouble className="inline mr-2" /> {order.paymentStatus.toUpperCase()}
                </p>
              </>
            ) : order.paymentStatus === "failed" ? (
              <>
                <p className="text-red-600 bg-[#4a2e2e] px-2 py-1 rounded-lg">
                  <FaCircle className="inline mr-2" /> {order.paymentStatus.toUpperCase()}
                </p>
              </>
            ) : <>
              <p className="text-yellow-600 bg-[#4a452e] px-2 py-1 rounded-lg">
                <FaCircle className="inline mr-2" /> {order.paymentStatus.toUpperCase()}
              </p>
            </>}
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderList;
