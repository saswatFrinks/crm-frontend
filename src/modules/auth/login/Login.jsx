import logo from '@/assets/logo.svg';
import Input from '@/shared/ui/Input';
import Label from '@/shared/ui/Label';
import Button from '@/shared/ui/Button';
import { Link } from 'react-router-dom';
import authService from '../auth.service';
import toast from 'react-hot-toast';
import { useFormik } from 'formik';

export default function Login() {
  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validate: (values) => {
      const errors = {};

      // Add your custom validation logic here
      if (!values.email) {
        errors.email = 'Email is required';
      } else if (
        !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
      ) {
        errors.email = 'Enter a valid email id';
      }

      if (!values.password) {
        errors.password = 'Password is required';
      } else if (values.password.length < 6) {
        errors.password = 'Password must be at least 6 characters long';
      }

      return errors;
    },
    onSubmit: async (values) => {
      console.log(values);
      try {
        await authService.login(values);
        toast.success('Login successfully!');
      } catch (error) {
        // formik.setFieldError('password', 'Incorrect password');
        console.log(error);
        toast.error(error.response.data.data.message);
      }
    },
  });

  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <img src={logo} alt="logo" className="mb-8" />

      <form
        onSubmit={formik.handleSubmit}
        className="flex max-w-sm flex-col gap-4 rounded-lg border-[1px] border-gray-500  bg-white p-6 shadow"
      >
        <h1 className=" text-center text-4xl font-bold">Sign in</h1>

        <p className="text-center">
          Sign in to your workspace for managing projects
        </p>
        <div>
          <Label>Email Id</Label>
          <Input
            placeholder="Enter email id"
            type="email"
            name="email"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.email}
            errorMessage={formik.errors.email}
          />
        </div>

        <div>
          <Label>Password</Label>
          <Input
            placeholder="Enter password"
            type="password"
            name="password"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.password}
            errorMessage={formik.errors.password}
          />
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
