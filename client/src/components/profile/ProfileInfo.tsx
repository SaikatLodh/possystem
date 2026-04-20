import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQlMutation } from '../../graphql/globalRequest';
import { updateUser } from '../../graphql/query/user';
import { enqueueSnackbar } from 'notistack';
import { QueryClient } from '@tanstack/react-query';

const profileSchema = z.object({
  fullname: z.string().min(3, "Full name must be at least 3 characters").max(50, "Full name is too long"),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

interface ProfileInfoProps {
  user: any;
  queryClient: QueryClient;
  userKey: string;
}

const ProfileInfo: React.FC<ProfileInfoProps> = ({ user, queryClient, userKey }) => {

  const { mutate: updateMutation, isPending } = useQlMutation(updateUser);

  const { register, handleSubmit, formState: { errors } } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullname: user?.fullname || "",
    }
  });

  const onSubmit = (data: ProfileFormValues) => {
    updateMutation({
      fullname: data.fullname,
    }, {
      onSuccess: (res) => {
        if (res.updateUser.status === 200 || res.updateUser.status === 201) {
          enqueueSnackbar(res.updateUser.message, { variant: 'success' });
          queryClient.invalidateQueries({ queryKey: [userKey] });
        } else {
          enqueueSnackbar(res.updateUser.message, { variant: 'error' });
        }
      },
      onError: (error: any) => {
        enqueueSnackbar(error.response?.errors?.[0]?.message || 'Failed to update profile', { variant: 'error' });
      }
    });
  };

  return (
    <div className='p-8 bg-[#1a1a1a] rounded-3xl border border-white/5 shadow-2xl'>
      <h3 className='text-[#f5f5f5] text-lg font-bold mb-6 flex items-center gap-2'>
        <span className='w-1.5 h-6 bg-[#F6B100] rounded-full' />
        Personal Information
      </h3>

      <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-5'>
        <div className='flex flex-col gap-1.5'>
          <label className='text-sm font-semibold text-[#adaaaa] ml-1 text-uppercase tracking-wider'>Full Name</label>
          <input
            {...register('fullname')}
            placeholder="Enter your full name"
            className='w-full bg-[#131313] text-[#f5f5f5] px-5 py-4 rounded-2xl border border-white/5 focus:border-[#F6B100]/30 outline-none transition-all placeholder:text-[#333] shadow-inner'
          />
          {errors.fullname && <p className='text-red-400 text-xs mt-1 ml-1'>{errors.fullname.message as string}</p>}
        </div>

        <button
          type="submit"
          disabled={isPending}
          className='mt-2 py-4 bg-[#F6B100] hover:bg-[#fdc003] text-white cursor-pointer font-black rounded-2xl transition-all shadow-[0_10px_20px_rgba(246,177,0,0.1)] active:scale-[0.98] disabled:opacity-50 tracking-wider'
        >
          {isPending ? 'Updating...' : 'SAVE CHANGES'}
        </button>
      </form>
    </div>
  );
};

export default ProfileInfo;
