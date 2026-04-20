import React, { useState } from 'react';
import { useQlMutation } from '../../graphql/globalRequest';
import { updateUser } from '../../graphql/query/user';
import { enqueueSnackbar } from 'notistack';
import { MdOutlineCameraEnhance } from 'react-icons/md';
import { QueryClient } from '@tanstack/react-query';
import type { User } from '../../interface';


interface ProfilePictureProps {
  user: User;
  queryClient: QueryClient;
  userKey: string;
}

const ProfilePicture: React.FC<ProfilePictureProps> = ({ user, queryClient, userKey }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(user?.profilePicture || "/assets/icon-7797704_640.png");
  const { mutate: updateMutation, isPending } = useQlMutation(updateUser);


  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = () => {
    if (!selectedFile) return;

    updateMutation({
      file: selectedFile,
    }, {
      onSuccess: (res) => {
        if (res.updateUser.status === 200 || res.updateUser.status === 201) {
          enqueueSnackbar(res.updateUser.message, { variant: 'success' });
          queryClient.invalidateQueries({ queryKey: [userKey] });
          setSelectedFile(null);
          setPreviewImage(null);
        } else {
          enqueueSnackbar(res.updateUser.message, { variant: 'error' });
        }
      },
      onError: (error: any) => {
        enqueueSnackbar(error.response?.errors?.[0]?.message || 'Failed to update profile picture', { variant: 'error' });
      }
    });
  };

  return (
    <div className='flex flex-col items-center gap-6 p-8 bg-[#1a1a1a] rounded-3xl border border-white/5 shadow-2xl'>
      <div className='relative group'>
        <div className='w-32 h-32 rounded-full overflow-hidden border-4 border-[#F6B100]/20 shadow-2xl transition-transform duration-500 group-hover:scale-105'>
          <img
            src={previewImage || user?.profilePicture || "/assets/icon-7797704_640.png"}
            alt="Profile"
            className='w-full h-full object-cover'
          />
        </div>
        <label className='absolute bottom-0 right-0 p-2.5 bg-[#F6B100] text-[#3d2b00] rounded-full cursor-pointer shadow-lg hover:bg-[#fdc003] transition-all transform hover:scale-110 active:scale-95'>
          <MdOutlineCameraEnhance size={20} />
          <input type="file" accept="image/*" className='hidden' onChange={handleFileChange} />
        </label>
      </div>

      <div className='text-center'>
        <h2 className='text-[#f5f5f5] text-xl font-bold tracking-tight'>{user?.fullname}</h2>
        <p className='text-[#adaaaa] text-sm font-medium mt-1'>{user?.email}</p>
      </div>

      {selectedFile && (
        <button
          onClick={handleUpload}
          disabled={isPending}
          className='w-full py-3 bg-[#F6B100] hover:bg-[#fdc003] cursor-pointer text-[#3d2b00] font-bold rounded-xl transition-all shadow-[0_10px_20px_rgba(246,177,0,0.15)] disabled:opacity-50 active:scale-[0.98]'
        >
          {isPending ? 'Uploading...' : 'Save New Picture'}
        </button>
      )}
    </div>
  );
};

export default ProfilePicture;
