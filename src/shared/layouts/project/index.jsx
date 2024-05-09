import { Outlet } from 'react-router-dom';
import Sidebar from './sidebar';
import { Toaster } from 'react-hot-toast';

export default function ProjectLayout() {
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
