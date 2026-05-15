import { useEffect, useState } from "react";
import BackButton from "../components/shared/BackButton";
import TableCard from "../components/table/TableCard";
import TableSkeleton from "../components/table/TableSkeleton";
import useQlQuery from "../graphql/globalRequest";
import { TABLES } from "../tanstackKeys";
import { getAllTables } from "../graphql/query/table";
import TableModal from "../components/table/TableModal";
import DeleteTableModal from "../components/table/DeleteTableModal";
import BookingModal from "../components/table/BookingModal";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAppSelector } from "../store/hook";
import { useNavigate } from "react-router-dom";

const schema = z.object({
  tableNumber: z
    .number({ message: "Table number is required" })
    .min(1, "Table number is required"),
  capacity: z
    .number({ message: "Capacity must be a number" })
    .min(1, "Capacity must be at least 1"),
});

type FormValues = z.infer<typeof schema>;
const Tables = () => {
  const [status, setStatus] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editTableId, setEditTableId] = useState<string | null>(null);
  const [tableToDelete, setTableToDelete] = useState<{
    id: string;
    name: number;
  } | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [tableToBook, setTableToBook] = useState<{
    id: string;
    name: number;
  } | null>(null);
  const [tableStatus, setTableStatus] = useState<string>("")
  const { user } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "POS | Tables";
  }, []);

  const { data: resData, isLoading } = useQlQuery(TABLES, getAllTables);

  const filteredTables = resData?.getTables.tables.filter((table) => {
    if (status === "all") return table;
    if (status === "booked") return table.status === "unavailable";
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const openCreateModal = () => {
    setEditTableId(null);
    setIsModalOpen(true);
  };


  const openEditModal = (id: string, name: number, seats: number) => {
    setIsModalOpen(true);
    setEditTableId(id);
    reset({
      tableNumber: name,
      capacity: seats,
    });


  };
  const openDeleteModal = (id: string, name: number) => {
    setTableToDelete({ id, name });
    setIsDeleteModalOpen(true);
  };

  const handleTableClick = (id: string, name: number, status: string) => {
    setTableToBook({ id, name });
    setTableStatus(status);
    setIsBookingModalOpen(true);
  };

  return (
    <>
      <section className="bg-[#1f1f1f]  h-[calc(100vh-5rem)] overflow-hidden">
        <div className="flex items-center justify-between px-10 py-4">
          <div className="flex items-center gap-4 ">
            <BackButton />
            <h1 className="text-[#f5f5f5] text-2xl font-bold tracking-wider">
              Tables
            </h1>
          </div>
          <div className="flex items-center justify-around gap-4">
            {user?.role === "admin" && (
              <button
                onClick={openCreateModal}
                className={`text-white text-lg bg-[#F6B100] rounded-lg px-5 py-2 font-semibold cursor-pointer`}
              >
                Create Table
              </button>
            )}
            <button
              onClick={() => setStatus("all")}
              className={`text-[#ababab] text-lg ${status === "all" && "bg-[#383838] rounded-lg px-5 py-2"
                }  rounded-lg px-5 py-2 font-semibold cursor-pointer`}
            >
              All
            </button>
            <button
              onClick={() => setStatus("booked")}
              className={`text-[#ababab] text-lg ${status === "booked" && "bg-[#383838] rounded-lg px-5 py-2"
                }  rounded-lg px-5 py-2 font-semibold cursor-pointer`}
            >
              Booked
            </button>
          </div>
        </div>

        <div className="grid grid-cols-5 gap-3 px-16 py-4  overflow-y-scroll scrollbar-hide">
          {isLoading
            ? Array.from({ length: 15 }).map((_, i) => (
              <TableSkeleton key={i} />
            ))
            : filteredTables?.map((table) => {
              return (
                <TableCard
                  key={table.id}
                  id={table.id}
                  name={table.tableNumber}
                  status={table.status}
                  initials={table.tableNumber}
                  seats={table.capacity}
                  onEdit={openEditModal}
                  onDelete={openDeleteModal}
                  onClick={handleTableClick}
                  user={user}
                />
              );
            })}
        </div>

        <TableModal
          register={register}
          handleSubmit={handleSubmit}
          reset={reset}
          errors={errors}
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          editTableId={editTableId}
          setEditTableId={setEditTableId}
        />
        <DeleteTableModal
          isDeleteModalOpen={isDeleteModalOpen}
          setIsDeleteModalOpen={setIsDeleteModalOpen}
          tableToDelete={tableToDelete}
          setTableToDelete={setTableToDelete}
        />
        <BookingModal
          isModalOpen={isBookingModalOpen}
          setIsModalOpen={setIsBookingModalOpen}
          tableToBook={tableToBook}
          setTableToBook={setTableToBook}
          tableStatus={tableStatus}

        />
      </section>
    </>
  );
};

export default Tables;
