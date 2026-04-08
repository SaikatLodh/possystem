import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { enqueueSnackbar } from "notistack";
import { forgotPassword } from "../../graphql/query/auth";
import { useQlMutation } from "../../graphql/globalRequest";
import { useParams } from "react-router-dom";

const passwordSchema = z
  .object({
    newPassword: z
      .string()
      .min(1, "Password is required")
      .min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(1, "Confirm password is required"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type PasswordFormData = z.infer<typeof passwordSchema>;

const ForgotPassword = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
  });
  const { mutate, isPending } = useQlMutation(forgotPassword);
  const { token } = useParams<{ token: string }>();
  const onSubmit = (data: PasswordFormData) => {
    mutate(
      {
        newPassword: data.newPassword,
        confirmPassword: data.confirmPassword,
        token: token || "",
      },
      {
        onSuccess: (response) => {
          if (
            response.forgotPassword.status === 200 ||
            response.forgotPassword.status === 201
          ) {
            enqueueSnackbar(response.forgotPassword.message, {
              variant: "success",
            });
          }else {
            enqueueSnackbar(response.forgotPassword.message, {
              variant: "error",
            });
          }
        },
        onError: (error: any) => {
          enqueueSnackbar(
            error.response.errors[0].message || "Failed to change password",
            {
              variant: "error",
            },
          );
        },
      },
    );
  };

  return (
    <>
      <div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label className="block text-[#ababab] mb-2 mt-3 text-sm font-medium">
              New Password
            </label>
            <div className="flex item-center rounded-lg p-5 px-4 bg-[#1f1f1f]">
              <input
                type="password"
                {...register("newPassword")}
                placeholder="New password"
                className="bg-transparent flex-1 text-white focus:outline-none"
              />
            </div>
            {errors.newPassword && (
              <p className="text-red-500 text-sm mt-1">
                {errors.newPassword.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-[#ababab] mb-2 mt-3 text-sm font-medium">
              Confirm Password
            </label>
            <div className="flex item-center rounded-lg p-5 px-4 bg-[#1f1f1f]">
              <input
                type="password"
                {...register("confirmPassword")}
                placeholder="Confirm password"
                className="bg-transparent flex-1 text-white focus:outline-none"
              />
            </div>
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full rounded-lg mt-6 py-3 text-lg bg-yellow-400 text-gray-900 font-bold disabled:opacity-50"
          >
            {isPending ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>
    </>
  );
};

export default ForgotPassword;
