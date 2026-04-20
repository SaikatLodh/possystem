
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQlMutation } from '../../graphql/globalRequest';
import { changePassword } from '../../graphql/query/user';
import { enqueueSnackbar } from 'notistack';

const passwordSchema = z.object({
  oldPassword: z.string().min(6, "Password must be at least 6 characters").max(30, "Password must be at most 30 characters"),
  newPassword: z.string().min(6, "Password must be at least 6 characters").max(30, "Password must be at most 30 characters"),
  confirmPassword: z.string().min(6, "Password must be at least 6 characters").max(30, "Password must be at most 30 characters"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type PasswordFormValues = z.infer<typeof passwordSchema>;

const ChangePassword = () => {
  const { mutate: updateMutation, isPending } = useQlMutation(changePassword);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
  });

  const onSubmit = (data: PasswordFormValues) => {
    updateMutation({
      oldPassword: data.oldPassword,
      newPassword: data.newPassword,
      confirmPassword: data.confirmPassword,
    }, {
      onSuccess: (res) => {
        if (res.changePassword.status === 200 || res.changePassword.status === 201) {
          enqueueSnackbar(res.changePassword.message, { variant: 'success' });
          reset();
        } else {
          enqueueSnackbar(res.changePassword.message, { variant: 'error' });
        }
      },
      onError: (error: any) => {
        enqueueSnackbar(error.response?.errors?.[0]?.message || 'Failed to update password', { variant: 'error' });
      }
    });
  };

  return (
    <div className='p-8 bg-[#1a1a1a] rounded-3xl border border-white/5 shadow-2xl'>
      <h3 className='text-[#f5f5f5] text-lg font-bold mb-6 flex items-center gap-2'>
        <span className='w-1.5 h-6 bg-[#F6B100] rounded-full' />
        Security
      </h3>

      <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-5'>
        <div className='flex flex-col gap-1.5'>
          <label className='text-sm font-semibold text-[#adaaaa] ml-1 tracking-wider'>OLD PASSWORD</label>
          <input
            {...register('oldPassword')}
            type="password"
            placeholder="••••••••"
            className='w-full bg-[#131313] text-[#f5f5f5] px-5 py-4 rounded-2xl border border-white/5 focus:border-[#F6B100]/30 outline-none transition-all placeholder:text-[#333] shadow-inner'
          />
          {errors.oldPassword && <p className='text-red-400 text-xs mt-1 ml-1'>{errors.oldPassword.message as string}</p>}
        </div>

        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
          <div className='flex flex-col gap-1.5'>
            <label className='text-sm font-semibold text-[#adaaaa] ml-1 tracking-wider'>NEW PASSWORD</label>
            <input
              {...register('newPassword')}
              type="password"
              placeholder="••••••••"
              className='w-full bg-[#131313] text-[#f5f5f5] px-5 py-4 rounded-2xl border border-white/5 focus:border-[#F6B100]/30 outline-none transition-all placeholder:text-[#333] shadow-inner'
            />
            {errors.newPassword && <p className='text-red-400 text-xs mt-1 ml-1'>{errors.newPassword.message as string}</p>}
          </div>

          <div className='flex flex-col gap-1.5'>
            <label className='text-sm font-semibold text-[#adaaaa] ml-1 tracking-wider'>CONFIRM PASSWORD</label>
            <input
              {...register('confirmPassword')}
              type="password"
              placeholder="••••••••"
              className='w-full bg-[#131313] text-[#f5f5f5] px-5 py-4 rounded-2xl border border-white/5 focus:border-[#F6B100]/30 outline-none transition-all placeholder:text-[#333] shadow-inner'
            />
            {errors.confirmPassword && <p className='text-red-400 text-xs mt-1 ml-1'>{errors.confirmPassword.message as string}</p>}
          </div>
        </div>

        <button
          type="submit"
          disabled={isPending}
          className='mt-2 py-4 bg-[#F6B100] hover:bg-[#fdc003] text-white cursor-pointer font-black rounded-2xl transition-all shadow-[0_10px_20px_rgba(246,177,0,0.1)] active:scale-[0.98] disabled:opacity-50 tracking-wider'
        >
          {isPending ? 'Updating...' : 'CHANGE PASSWORD'}
        </button>
      </form>
    </div>
  );
};

export default ChangePassword;
