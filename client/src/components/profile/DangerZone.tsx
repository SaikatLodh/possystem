import React, { useState } from 'react';
import { useQlMutation } from '../../graphql/globalRequest';
import { deleteUser } from '../../graphql/query/user';
import { enqueueSnackbar } from 'notistack';
import { useAppDispatch, useAppSelector } from '../../store/hook';
import { logout } from '../../store/auth/authSlice';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { MdLogout, MdDeleteForever } from 'react-icons/md';
import { QueryClient } from '@tanstack/react-query';
import DeleteAccountModal from './DeleteAccountModal';
import LogoutConfirmModal from './LogoutConfirmModal';


const DangerZone: React.FC<{ queryClient: QueryClient }> = ({ queryClient }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);
  const { mutate: deleteMutation, isPending } = useQlMutation(deleteUser);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);


  const handleLogout = () => {
    dispatch(logout());
    Cookies.remove('accessToken');
    Cookies.remove('refreshToken');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    queryClient.clear();
    enqueueSnackbar('Logged out successfully', { variant: 'success' });
    navigate('/login');

  };

  const handleDeleteUser = () => {
    deleteMutation({}, {
      onSuccess: (res) => {
        if (res.deleteUser.status === 200 || res.deleteUser.status === 201) {
          queryClient.clear();
          handleLogout();
          enqueueSnackbar(res.deleteUser.message, { variant: 'success' });

        } else {
          enqueueSnackbar(res.deleteUser.message, { variant: 'error' });
        }
        setIsDeleteModalOpen(false);
      },
      onError: (error: any) => {
        setIsDeleteModalOpen(false);
        enqueueSnackbar(error.response?.errors?.[0]?.message || 'Failed to delete account', { variant: 'error' });
      }
    });
  };

  return (
    <div className='flex flex-col gap-4'>
      <div className='p-8 bg-[#1a1a1a] rounded-3xl border border-white/5 shadow-2xl flex items-center justify-between group'>
        <div className='flex items-center gap-4'>
          <div className='p-3 bg-white/5 rounded-2xl text-[#adaaaa] group-hover:bg-[#F6B100]/10 group-hover:text-[#F6B100] transition-all'>
            <MdLogout size={24} />
          </div>
          <div>
            <h3 className='text-[#f5f5f5] text-lg font-bold'>Logout</h3>
            <p className='text-[#adaaaa] text-sm'>Sign out of your account session</p>
          </div>
        </div>
        <button
          onClick={() => setIsLogoutModalOpen(true)}
          className='px-6 py-2.5 bg-white/5 hover:bg-white/10 text-[#f5f5f5] font-bold rounded-xl border border-white/10 transition-all cursor-pointer'
        >
          Logout
        </button>
      </div>

      <div className='p-8 bg-[#1a1a1a] rounded-3xl border border-red-500/10 shadow-2xl flex items-center justify-between group border-dashed'>
        <div className='flex items-center gap-4'>
          <div className='p-3 bg-red-500/5 rounded-2xl text-red-500/50 group-hover:bg-red-500/10 group-hover:text-red-500 transition-all'>
            <MdDeleteForever size={24} />
          </div>
          <div>
            <h3 className='text-red-500 text-lg font-bold'>Delete Account</h3>
            <p className='text-[#adaaaa] text-sm'>Irreversibly remove all your data</p>
          </div>
        </div>
        <button
          onClick={() => setIsDeleteModalOpen(true)}
          disabled={isPending}
          className='px-6 py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-500 font-bold rounded-xl border border-red-500/20 transition-all cursor-pointer disabled:opacity-50'
        >
          {isPending ? 'Deleting...' : 'Delete'}
        </button>
      </div>

      <DeleteAccountModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteUser}
        registeredEmail={user?.email || ''}
        isPending={isPending}
      />

      <LogoutConfirmModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleLogout}
      />
    </div>
  );
};

export default DangerZone;
