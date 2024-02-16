import withAuth from '@/shared/hocs/withAuthenticated';
import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './sidebar';

function MainLayout() {
  return (
    <>
      <Sidebar />
      <div className="bg-[#f7f9fa] h-full min-h-screen md:ml-64">
        <Outlet />
      </div>
    </>
  );
}

export default withAuth(MainLayout);
