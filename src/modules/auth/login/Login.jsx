import logo from '@/assets/logo.svg';
import Input from '@/shared/ui/Input';
import Label from '@/shared/ui/Label';
import Button from '@/shared/ui/Button';
import { Link } from 'react-router-dom';
import authService from '../auth.service';
import toast from 'react-hot-toast';

export default function Login() {
  const login = async (e) => {
    e.preventDefault();
    try {
      const res = await authService.login({});
      toast.success('Login successfully!');
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <img src={logo} alt="logo" className="mb-8" />

      <form
        onSubmit={login}
        className="flex max-w-sm flex-col gap-4 rounded-lg border-[1px] border-gray-500  bg-white p-6 shadow dark:border-gray-700 dark:bg-gray-800"
      >
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

        <Button type="submit">Log in</Button>
        <p>
          Unable to login? Reach out to{' '}
          <span className="font-semibold">Administrator</span>
        </p>
        <Link to={'/register'} className="mx-auto block w-full">
          <Button color="flat">Sign up</Button>
        </Link>
      </form>
    </div>
  );
}
