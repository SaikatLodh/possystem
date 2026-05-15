import { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import Modal from "../shared/Modal";
import { enqueueSnackbar } from "notistack";
import { useQueryClient } from "@tanstack/react-query";
import { useQlMutation } from "../../graphql/globalRequest";
import { createWaiter } from "../../graphql/query/admin";
import { WAITERS } from "../../tanstackKeys";

const CreateWaiterModal = ({
  register,
  handleSubmit,
  reset,
  errors,
  isModalOpen,
  setIsModalOpen,
}: {
  register: any;
  handleSubmit: any;
  reset: any;
  errors: any;
  isModalOpen: boolean;
  setIsModalOpen: (value: boolean) => void;
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const { mutate, isPending } = useQlMutation(createWaiter);
  const queryClient = useQueryClient();

  const closeModal = () => {
    setIsModalOpen(false);
    reset({ fullname: "", email: "", password: "", number: "" });
  };

  const onSubmit = (data: {
    fullname: string;
    email: string;
    password: string;
    number: string;
  }) => {
    mutate(data, {
      onSuccess: (res) => {
        const r = (res as any).createWaiter;
        if (r.status === 200 || r.status === 201) {
          enqueueSnackbar(r.message, { variant: "success" });
          queryClient.refetchQueries({ queryKey: [WAITERS] });
          closeModal();
        } else {
          enqueueSnackbar(r.message, { variant: "error" });
        }
      },
      onError: (error: any) => {
        enqueueSnackbar(
          error.response?.errors?.[0]?.message || "Failed to create waiter",
          { variant: "error" },
        );
      },
    });
  };

  return (
    <Modal isOpen={isModalOpen} onClose={closeModal} title="Create Waiter">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        {/* Full Name */}
        <div>
          <label className="block text-sm font-semibold text-[#adaaaa] mb-1">
            Full Name
          </label>
          <input
            {...register("fullname")}
            type="text"
            placeholder="e.g. John Doe"
            className="w-full bg-[#131313] text-[#f5f5f5] px-4 py-3 rounded-xl border border-white/5 focus:border-[#ffd16c]/30 outline-none transition-all placeholder:text-[#444]"
          />
          {errors.fullname && (
            <p className="text-red-400 text-xs mt-1">
              {errors.fullname.message}
            </p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-semibold text-[#adaaaa] mb-1">
            Email Address
          </label>
          <input
            {...register("email")}
            type="email"
            placeholder="e.g. john@restaurant.com"
            className="w-full bg-[#131313] text-[#f5f5f5] px-4 py-3 rounded-xl border border-white/5 focus:border-[#ffd16c]/30 outline-none transition-all placeholder:text-[#444]"
          />
          {errors.email && (
            <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>
          )}
        </div>

        {/* Phone Number */}
        <div>
          <label className="block text-sm font-semibold text-[#adaaaa] mb-1">
            Phone Number
          </label>
          <input
            {...register("number")}
            type="text"
            placeholder="e.g. 9876543210"
            className="w-full bg-[#131313] text-[#f5f5f5] px-4 py-3 rounded-xl border border-white/5 focus:border-[#ffd16c]/30 outline-none transition-all placeholder:text-[#444]"
          />
          {errors.number && (
            <p className="text-red-400 text-xs mt-1">{errors.number.message}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-semibold text-[#adaaaa] mb-1">
            Password
          </label>
          <div className="relative">
            <input
              {...register("password")}
              type={showPassword ? "text" : "password"}
              placeholder="Min. 6 characters"
              className="w-full bg-[#131313] text-[#f5f5f5] px-4 py-3 pr-12 rounded-xl border border-white/5 focus:border-[#ffd16c]/30 outline-none transition-all placeholder:text-[#444]"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#adaaaa] hover:text-[#F6B100] transition-colors cursor-pointer"
            >
              {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
            </button>
          </div>
          {errors.password && (
            <p className="text-red-400 text-xs mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Info note */}
        <p className="text-[#666] text-xs leading-relaxed border border-white/5 bg-[#131313] rounded-xl px-4 py-3">
          📧 Login credentials will be emailed to the waiter automatically after
          creation.
        </p>

        {/* Actions */}
        <div className="flex justify-end gap-3 mt-1">
          <button
            type="button"
            onClick={closeModal}
            className="px-6 py-2.5 rounded-xl border border-white/10 text-[#adaaaa] hover:bg-white/5 transition-colors font-medium cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isPending}
            className="px-6 py-2.5 rounded-xl bg-[#F6B100] hover:bg-[#fdc003] text-white font-bold shadow-[0_0_20px_rgba(255,209,108,0.2)] transition-all cursor-pointer flex items-center justify-center min-w-[140px] disabled:opacity-60"
          >
            {isPending ? "Creating..." : "Create Waiter"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateWaiterModal;
