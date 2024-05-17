import withAuth from '@/shared/hocs/withAuthenticated';
import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from './sidebar';
import { Toaster } from 'react-hot-toast';
import { setNavigate } from '@/core/request/aixosinstance';

function MainLayout() {
  const navigate = useNavigate();
  setNavigate(navigate);

  return (
    <>
      <Toaster position='top-center'/>
      <Sidebar />
      <div className="h-full min-h-screen bg-[#f7f9fa] md:ml-64">
        <Outlet />
      </div>
    </>
  );
}

export default withAuth(MainLayout);
