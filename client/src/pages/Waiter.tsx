import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FaUserTie } from "react-icons/fa";
import { MdTableBar } from "react-icons/md";
import { MdOutlineReorder } from "react-icons/md";
import { useAppSelector } from "../store/hook";
import useQlQuery, { useQlMutation } from "../graphql/globalRequest";
import { getWaiters, deleteWaiter as deleteWaiterMutation } from "../graphql/query/admin";
import { WAITERS } from "../tanstackKeys";
import { useQueryClient } from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";
import type { User as UserType } from "../interface";
import BackButton from "../components/shared/BackButton";
import CreateWaiterModal from "../components/waiter/CreateWaiterModal";
import WaiterList from "../components/waiter/WaiterList";
import DeleteWaiterModal from "../components/waiter/DeleteWaiterModal";

/* ── Zod Schema ──────────────────────────────────────────────── */
const waiterSchema = z.object({
  fullname: z
    .string()
    .trim()
    .min(3, "Full name must be at least 3 characters")
    .max(50, "Full name must be at most 50 characters"),
  email: z.string().trim().email("Please enter a valid email address"),
  number: z
    .string()
    .trim()
    .min(1, "Phone number is required")
    .regex(/^\+?[0-9\s\-()]{7,15}$/, "Invalid phone number"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(32, "Password must be at most 32 characters"),
});

type WaiterFormValues = z.infer<typeof waiterSchema>;

/* ── Component ───────────────────────────────────────────────── */
const Waiter = () => {
  const { user } = useAppSelector((state) => state.auth);
  const isAdmin = user?.role === "admin";
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedWaiter, setSelectedWaiter] = useState<UserType | null>(null);

  const queryClient = useQueryClient();
  const { data, isLoading } = useQlQuery(WAITERS, getWaiters);
  const waiters = data?.waiters?.waiters || [];

  const { mutate: deleteMutate, isPending: isDeleting } = useQlMutation(deleteWaiterMutation);

  useEffect(() => {
    document.title = "POS | Waiter";
  }, []);

  const openDeleteModal = (waiter: UserType) => {
    setSelectedWaiter(waiter);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedWaiter(null);
  };

  const handleDeleteConfirm = () => {
    if (!selectedWaiter) return;

    deleteMutate({ id: selectedWaiter.id }, {
      onSuccess: (res) => {
        const r = (res as any).deleteWaiter;
        if (r.status === 200) {
          enqueueSnackbar(r.message, { variant: "success" });
          queryClient.invalidateQueries({ queryKey: [WAITERS] });
          closeDeleteModal();
        } else {
          enqueueSnackbar(r.message, { variant: "error" });
        }
      },
      onError: (error: any) => {
        enqueueSnackbar(
          error.response?.errors?.[0]?.message || "Failed to delete waiter",
          { variant: "error" }
        );
      }
    });
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<WaiterFormValues>({
    resolver: zodResolver(waiterSchema),
    defaultValues: { fullname: "", email: "", number: "", password: "" },
  });

  return (
    <>
      <section className="bg-[#1f1f1f] h-[calc(100vh-5rem)] overflow-y-auto">
        {/* ── Page Header ── */}
        <div className="flex items-center justify-between px-10 py-4">
          <div className="flex items-center gap-4">
            <BackButton />
            <h1 className="text-[#f5f5f5] text-2xl font-bold tracking-wider">
              {isAdmin ? "Waiters" : "Dashboard"}
            </h1>
          </div>

          {/* Admin: Create Waiter button */}
          {isAdmin && (
            <button
              onClick={() => setIsModalOpen(true)}
              className={`text-white text-lg bg-[#F6B100] rounded-lg px-5 py-2 font-semibold cursor-pointer`}
            >
              Create Waiter
            </button>
          )}
        </div>

        {/* ── Waiter Personal Dashboard (for waiter role) ── */}
        {!isAdmin && (
          <div className="px-6 pb-10">
            {/* Welcome Header */}
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-[#343434] p-3 rounded-full">
                <FaUserTie size={28} className="text-[#F6B100]" />
              </div>
              <div>
                <p className="text-[#f5f5f5] text-xl font-bold capitalize">
                  Welcome, {user?.fullname || "Waiter"}
                </p>
                <p className="text-[#ababab] text-sm">Waiter Dashboard</p>
              </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-[#262626] rounded-2xl p-4 flex items-center gap-3">
                <div className="bg-[#F6B100]/20 p-3 rounded-xl">
                  <MdTableBar size={24} className="text-[#F6B100]" />
                </div>
                <div>
                  <p className="text-[#ababab] text-xs">Assigned Tables</p>
                  <p className="text-[#f5f5f5] text-2xl font-bold">—</p>
                </div>
              </div>
              <div className="bg-[#262626] rounded-2xl p-4 flex items-center gap-3">
                <div className="bg-green-500/20 p-3 rounded-xl">
                  <MdOutlineReorder size={24} className="text-green-400" />
                </div>
                <div>
                  <p className="text-[#ababab] text-xs">Active Orders</p>
                  <p className="text-[#f5f5f5] text-2xl font-bold">—</p>
                </div>
              </div>
            </div>

            {/* My Tables */}
            <div className="mb-6">
              <h2 className="text-[#f5f5f5] font-semibold text-base mb-3 flex items-center gap-2">
                <MdTableBar className="text-[#F6B100]" />
                My Tables
              </h2>
              <div className="bg-[#262626] rounded-2xl p-5 flex flex-col items-center justify-center min-h-[120px]">
                <MdTableBar size={36} className="text-[#444444] mb-2" />
                <p className="text-[#ababab] text-sm text-center">
                  No tables assigned yet
                </p>
              </div>
            </div>

            {/* Active Orders */}
            <div>
              <h2 className="text-[#f5f5f5] font-semibold text-base mb-3 flex items-center gap-2">
                <MdOutlineReorder className="text-green-400" />
                Active Orders
              </h2>
              <div className="bg-[#262626] rounded-2xl p-5 flex flex-col items-center justify-center min-h-[120px]">
                <MdOutlineReorder size={36} className="text-[#444444] mb-2" />
                <p className="text-[#ababab] text-sm text-center">
                  No active orders right now
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ── Admin: Waiters Management View ── */}
        {isAdmin && (
          <div className="px-10 pb-10">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-24">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#F6B100]"></div>
                <p className="text-[#ababab] mt-4 font-medium">
                  Fetching waiters...
                </p>
              </div>
            ) : waiters.length > 0 ? (
              <WaiterList waiters={waiters} onDelete={openDeleteModal} />
            ) : (
              /* Empty State */
              <div className="bg-[#262626] rounded-2xl flex flex-col items-center justify-center py-24 border border-white/5">
                <div className="bg-[#F6B100]/10 p-6 rounded-full mb-4">
                  <FaUserTie size={48} className="text-[#F6B100]" />
                </div>
                <p className="text-[#f5f5f5] text-lg font-semibold mb-1">
                  No waiters yet
                </p>
                <p className="text-[#ababab] text-sm mb-6 text-center max-w-xs">
                  Create your first waiter account. Login credentials will be
                  sent to them via email automatically.
                </p>
                {/* <button
                  onClick={() => setIsModalOpen(true)}
                  className="text-white text-lg bg-[#F6B100] rounded-lg px-5 py-2 font-semibold cursor-pointer"
                >

                  Create First Waiter  
                </button> */}
              </div>
            )}
          </div>
        )}
      </section>

      {/* ── Modal ── */}
      <CreateWaiterModal
        register={register}
        handleSubmit={handleSubmit}
        reset={reset}
        errors={errors}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
      />

      <DeleteWaiterModal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={handleDeleteConfirm}
        isPending={isDeleting}
        waiterName={selectedWaiter?.fullname}
      />
    </>
  );
};

export default Waiter;
