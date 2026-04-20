import { useAppSelector } from '../store/hook';
import BackButton from '../components/shared/BackButton';
import ProfilePicture from '../components/profile/ProfilePicture';
import ProfileInfo from '../components/profile/ProfileInfo';
import ChangePassword from '../components/profile/ChangePassword';
import DangerZone from '../components/profile/DangerZone';
import { useQueryClient } from '@tanstack/react-query';
import { USER } from '../tanstackKeys';

const Profile = () => {
  const { user } = useAppSelector((state) => state.auth);
  const queryClient = useQueryClient();

  if (!user) {
    return (
      <div className='bg-[#0e0e0e] h-[calc(100vh-5rem)] flex items-center justify-center'>
        <div className='animate-pulse text-[#adaaaa] font-bold text-xl tracking-widest'>LOADING PROFILE...</div>
      </div>
    );
  }

  return (
    <div className='bg-[#1f1f1f]  h-[calc(100vh-5rem)] overflow-y-scroll'>
      {/* Header Section */}
      <div className="flex items-center gap-4 px-10 py-8 border-b border-white/5 bg-[#1f1f1f] backdrop-blur-xl sticky top-0 z-10 transition-all">
        <BackButton />
        <div>
          <h1 className="text-[#f5f5f5] text-3xl font-black tracking-tight flex items-center gap-3">
            Profile <span className='text-xs font-bold px-2 py-0.5 bg-[#F6B100]/10 text-[#F6B100] rounded-md uppercase tracking-[0.2em] ml-2'>Settings</span>
          </h1>
          <p className='text-[#adaaaa] text-sm font-medium mt-1'>Manage your account details and security</p>
        </div>
      </div>

      {/* Main Content */}
      <div className='max-w-4xl mx-auto w-full px-6 py-10 flex flex-col gap-8'>
        <div className='grid grid-cols-1 lg:grid-cols-12 gap-8'>
          {/* Sidebar / Profile Component */}
          <div className='lg:col-span-4'>
            <div className='sticky top-32'>
              <ProfilePicture user={user} queryClient={queryClient} userKey={USER} />
            </div>
          </div>

          {/* Main Forms Section */}
          <div className='lg:col-span-8 flex flex-col gap-8'>
            <ProfileInfo user={user} queryClient={queryClient} userKey={USER} />
            <ChangePassword />
          </div>
        </div>

        {/* Full-width Delete/Logout Section */}
        <div className='mt-4'>
          <DangerZone queryClient={queryClient} />
        </div>
      </div>
    </div>
  );
};

export default Profile;