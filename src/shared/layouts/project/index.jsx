import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from './sidebar';
import { Toaster } from 'react-hot-toast';
import { setNavigate } from '@/core/request/aixosinstance';

export default function ProjectLayout() {
  const navigate = useNavigate();
  setNavigate(navigate);

  return (
    <>
      <Toaster position='top-center'/>
      <Sidebar />
      <div className="h-full min-h-screen bg-[#f7f9fa] md:ml-16">
        <Outlet />
      </div>
    </>
  );
}
