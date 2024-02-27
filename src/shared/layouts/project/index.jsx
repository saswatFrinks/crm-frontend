import { Outlet } from 'react-router-dom';
import Sidebar from './sidebar';

export default function ProjectLayout() {
  return (
    <>
      <Sidebar />
      <div className="h-full min-h-screen bg-[#f7f9fa] md:ml-16">
        <Outlet />
      </div>
    </>
  );
}
