import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { enqueueSnackbar } from "notistack";
import { useQlMutation } from "../../graphql/globalRequest";
import { forgotSendMail } from "../../graphql/query/auth";

const emailSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email format"),
});

type EmailFormData = z.infer<typeof emailSchema>;

const ForgotSendMail = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EmailFormData>({
    resolver: zodResolver(emailSchema),
  });
  const { mutate, isPending } = useQlMutation(forgotSendMail);

  const onSubmit = (data: EmailFormData) => {
    mutate(data, {
      onSuccess: (response) => {
        if (
          response.forgotSendMail.status === 200 ||
          response.forgotSendMail.status === 201
        ) {
          enqueueSnackbar(response.forgotSendMail.message, {
            variant: "success",
          });
        } else {
          enqueueSnackbar(response.forgotSendMail.message, {
            variant: "error",
          });
        }
      },
      onError: (error: any) => {
        enqueueSnackbar(
          error.response.errors[0].message || "Failed to send reset link",
          { variant: "error" },
        );
      },
    });
  };

  return (
    <>
      <div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label className="block text-[#ababab] mb-2 mt-3 text-sm font-medium">
              Email Address
            </label>
            <div className="flex item-center rounded-lg p-5 px-4 bg-[#1f1f1f]">
              <input
                type="email"
                {...register("email")}
                placeholder="Enter email address"
                className="bg-transparent flex-1 text-white focus:outline-none"
              />
            </div>
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full rounded-lg mt-6 py-3 text-lg bg-yellow-400 text-gray-900 font-bold disabled:opacity-50"
          >
            {isPending ? "Sending..." : "Send Reset Link"}
          </button>
        </form>
      </div>
    </>
  );
};

export default ForgotSendMail;
