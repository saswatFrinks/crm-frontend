import React from 'react'
import { Toaster } from 'react-hot-toast';
import { Outlet } from 'react-router-dom'

const InstanceLayout = () => {
  return (
    <>
      <Toaster position='top-center'/>
      <div className="h-full min-h-screen bg-[#f7f9fa]">
        <Outlet />
      </div>
    </>
  )
}

export default InstanceLayout