import { useEffect, useState } from "react";
import BackButton from "../components/shared/BackButton";
import OrderCard from "../components/orders/OrderCard";
import { BOOKINGS, USER_BOOKINGS } from "../tanstackKeys";
import { getBookings, getUserBookings } from "../graphql/query/booking";
import useQlQuery from "../graphql/globalRequest";
import { FaClipboardList } from "react-icons/fa";
import { useAppSelector } from "../store/hook";
import type { Booking } from "../interface";
const Orders = () => {
  const [status, setStatus] = useState("all");
  const [bookings, setBookings] = useState<Booking[]>([]);
  useEffect(() => {
    document.title = "POS | Orders";
  }, []);
  const { user } = useAppSelector((state) => state.auth);

  const { data: bookingData } = useQlQuery(USER_BOOKINGS, getUserBookings);
  const { data: allbookingsData } = useQlQuery(BOOKINGS, getBookings);
  const filterd = bookings.filter((order) => {
    if (status === "all") return order;
    if (status === "confirmed") return order.confirmStatus === "confirmed";
    if (status === "not confirmed")
      return order.confirmStatus === "not confirmed";
    if (status === "pending") return order.confirmStatus === "pending";
  });
  useEffect(() => {
    if (user?.role === "admin" || user?.role === "waiter") {
      setBookings(allbookingsData?.getBookings?.bookings || []);
    } else {
      setBookings(bookingData?.getUserBookings?.bookings || []);
    }
  }, [allbookingsData, bookingData, user?.role]);



  return (
    <>
      <section className="bg-[#1f1f1f]  h-[calc(100vh-5rem)] overflow-hidden">
        <div className="flex items-center justify-between px-10 py-4">
          <div className="flex items-center gap-4">
            <BackButton />
            <h1 className="text-[#f5f5f5] text-2xl font-bold tracking-wider">
              Orders
            </h1>
          </div>
          <div className="flex items-center justify-around gap-4">
            <button
              onClick={() => setStatus("all")}
              className={`text-[#ababab] text-lg ${status === "all" && "bg-[#383838] rounded-lg px-5 py-2"}  rounded-lg px-5 py-2 font-semibold cursor-pointer`}
            >
              All
            </button>
            <button
              onClick={() => setStatus("confirmed")}
              className={`text-[#ababab] text-lg ${status === "confirmed" && "bg-[#383838] rounded-lg px-5 py-2"}  rounded-lg px-5 py-2 font-semibold cursor-pointer`}
            >
              confirmed
            </button>
            <button
              onClick={() => setStatus("not confirmed")}
              className={`text-[#ababab] text-lg ${status === "not confirmed" && "bg-[#383838] rounded-lg px-5 py-2"}  rounded-lg px-5 py-2 font-semibold cursor-pointer`}
            >
              not confirmed
            </button>
            <button
              onClick={() => setStatus("pending")}
              className={`text-[#ababab] text-lg ${status === "pending" && "bg-[#383838] rounded-lg px-5 py-2"}  rounded-lg px-5 py-2 font-semibold cursor-pointer`}
            >
              pending
            </button>
          </div>
        </div>

        <div
          className="grid grid-cols-2 gap-4 px-10 py-4 overflow-y-scroll scrollbar-hide h-full"
          style={{ gridAutoRows: "max-content" }}
        >
          {filterd && filterd.length > 0 ? (
            filterd.map((order) => {
              return <OrderCard key={order.id} order={order} />;
            })
          ) : (
            <div className="col-span-2 flex flex-col items-center justify-center mt-20">
              <div className="bg-[#262626] p-8 rounded-2xl flex flex-col items-center justify-center gap-4 border border-[#383838] shadow-lg w-[400px]">
                <div className="bg-[#383838] p-5 rounded-full">
                  <FaClipboardList className="text-5xl text-[#ababab]" />
                </div>
                <h2 className="text-[#f5f5f5] text-xl font-bold tracking-wide">
                  No Orders Found
                </h2>
                <p className="text-[#ababab] text-center text-sm">
                  There are currently no orders in the "
                  <span className="capitalize">{status}</span>" category.
                </p>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default Orders;
