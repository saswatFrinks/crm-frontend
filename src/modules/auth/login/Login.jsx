import React from 'react';
import logo from '@/assets/logo.svg';
import Input from '@/shared/ui/Input';
import Label from '@/shared/ui/Label';
import Button from '@/shared/ui/Button';

export default function Login() {
  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <img src={logo} alt="logo" className="mb-8" />

      <div className="flex max-w-sm flex-col gap-4 rounded-lg border-[1px] border-gray-500  bg-white p-6 shadow dark:border-gray-700 dark:bg-gray-800">
        <h1 className=" text-center text-4xl font-bold">Sign in</h1>

        <p className="text-center">
          Sign in to your workspace for managing projects
        </p>
        <div>
          <Label>Email Id</Label>
          <Input placeholder="Enter email id" type="email" />
        </div>

        <div>
          <Label>Password</Label>
          <Input placeholder="Enter password" type="password" />
        </div>

        <Button>Log in</Button>
        <p>
          Unable to login? Reach out to{' '}
          <span className="font-semibold">Administrator</span>
        </p>
        <Button color="flat">Sign up</Button>
      </div>
    </div>
  );
}
