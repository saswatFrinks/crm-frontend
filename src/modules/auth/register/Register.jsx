import React from 'react';
import logo from '@/assets/logo.svg';
import Label from '@/shared/ui/Label';
import Input from '@/shared/ui/Input';
import Button from '@/shared/ui/Button';
import { Link } from 'react-router-dom';

export default function Register() {
  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <img src={logo} alt="logo" className="mb-8" />

      <div className="flex  flex-col gap-6 rounded-lg border-[1px] border-gray-500  bg-white p-6 shadow dark:border-gray-700 dark:bg-gray-800">
        <h1 className=" text-center text-4xl font-bold">
          Welcome to Frinks AI
        </h1>

        <p className="text-center text-2xl font-semibold">Sign up</p>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="md:min-w-80">
            <Label>User Name</Label>
            <Input placeholder="Enter your name" type="text" />
          </div>

          <div className="md:min-w-8">
            <Label>User Email Id</Label>
            <Input placeholder="Enter your email" type="email" />
          </div>

          <div className="md:min-w-8">
            <Label>Organisation Name</Label>
            <Input placeholder="Enter your organisation name" type="email" />
          </div>

          <div className="md:min-w-8">
            <Label>Contact number</Label>
            <Input placeholder="Enter your contact number" type="email" />
          </div>

          <div className="md:min-w-8">
            <Label>Password</Label>
            <Input placeholder="Enter password" type="password" />
          </div>

          <div className="md:min-w-8">
            <Label>Confirm Password</Label>
            <Input placeholder="Re-enter password" type="password" />
          </div>
        </div>
        <div className="mx-auto flex w-full items-center gap-4 md:w-1/2">
          <Link to={'/login'} className="block w-full">
            <Button color="flat">Cancel</Button>
          </Link>
          <Button>Sign up</Button>
        </div>
        <p className="text-center">
          You can latter add more users in Teams & Users Section
        </p>
      </div>
    </div>
  );
}
