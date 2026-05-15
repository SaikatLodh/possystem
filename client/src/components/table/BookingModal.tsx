import Modal from "../shared/Modal";
import { enqueueSnackbar } from "notistack";
import { useQueryClient } from "@tanstack/react-query";
import { useQlMutation } from "../../graphql/globalRequest";
import { TABLES } from "../../tanstackKeys";
import { CREATE_BOOKING } from "../../graphql/query/booking";
import { useNavigate } from "react-router-dom";

const BookingModal = ({
  isModalOpen,
  setIsModalOpen,
  tableToBook,
  setTableToBook,
  tableStatus
}: {
  isModalOpen: boolean;
  setIsModalOpen: (value: boolean) => void;
  tableToBook: { id: string; name: number } | null;
  setTableToBook: (value: { id: string; name: number } | null) => void;
  tableStatus: string;

}) => {
  const { mutate, isPending } = useQlMutation(CREATE_BOOKING);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const closeModal = () => {
    setIsModalOpen(false);
    setTableToBook(null);
  };

  const handleBookTable = () => {
    if (!tableToBook) return;

    mutate(
      { tableId: tableToBook.id, foodsId: [] },
      {
        onSuccess: (res) => {
          if (res.createBooking.status === 200 || res.createBooking.status === 201) {
            enqueueSnackbar(res.createBooking.message, { variant: "success" });
            queryClient.refetchQueries({ queryKey: [TABLES] });
            closeModal();
            // Navigate to the menu after booking
            navigate(`/orders`);
          } else {
            enqueueSnackbar(res.createBooking.message, { variant: "error" });
          }
        },
        onError: (error: any) => {
          enqueueSnackbar(
            error.response?.errors?.[0]?.message || "Failed to book table",
            { variant: "error" }
          );
        },
      }
    );
  };

  return (
    <Modal
      isOpen={isModalOpen}
      onClose={closeModal}
      title="Book Table"
    >
      {
        tableStatus === "unavailable" ? (
          <div className="flex flex-col items-center justify-center py-4">
            <h2 className="text-[#f5f5f5] text-lg font-semibold mb-2">
              Table {tableToBook?.name} is already booked
            </h2>
            <div className="flex gap-4 w-full mt-4">
              <button
                onClick={closeModal}
                className="flex-1 py-3 rounded-xl border border-white/10 text-[#adaaaa] hover:bg-white/5 transition-colors font-medium cursor-pointer"
              >
                Cancel
              </button>

            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-4">
            <h2 className="text-[#f5f5f5] text-lg font-semibold mb-2">
              Are you sure you want to book Table {tableToBook?.name}?
            </h2>
            <p className="text-[#ababab] text-sm text-center mb-6">
              This will reserve the table and you can proceed to order food.
            </p>

            <div className="flex gap-4 w-full">
              <button
                onClick={closeModal}
                className="flex-1 py-3 rounded-xl border border-white/10 text-[#adaaaa] hover:bg-white/5 transition-colors font-medium cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleBookTable}
                disabled={isPending}
                className="flex-1 py-3 rounded-xl bg-[#F6B100] hover:bg-[#fdc003] text-white font-bold shadow-[0_0_20px_rgba(255,209,108,0.2)] transition-all cursor-pointer flex items-center justify-center"
              >
                {isPending ? "Booking..." : "Confirm Booking"}
              </button>
            </div>
          </div>
        )
      }
    </Modal>
  );
};

export default BookingModal;
