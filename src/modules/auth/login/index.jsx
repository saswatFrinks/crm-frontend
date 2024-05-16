import React from 'react';
import logo from '@/assets/logo.svg';
import Input from '@/shared/ui/Input';
import Label from '@/shared/ui/Label';
import Button from '@/shared/ui/Button';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../auth.service';
import toast, { Toaster } from 'react-hot-toast';
import { useFormik } from 'formik';
import storageService from '@/core/storage';
import { TOKEN } from '@/core/constants';
import { updateAuthenHeader } from '@/core/request/updateAuth';
import axiosInstance from '@/core/request/aixosinstance';
import { getCookie } from '@/shared/hocs/withAuthenticated';

export default function Login() {
  const navigate = useNavigate();

  React.useEffect(() => {
    if(getCookie()){
      navigate('/')
    }
  }, [])
  
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
        const res = await authService.login(values);
        const expires = new Date();
        expires.setTime(expires.getTime() + (2 * 24 * 60 * 60 * 1000)); //2 days
        const cookie = `${TOKEN}=${res.data.data.token};expires=${expires.toUTCString()};path=/`;
        document.cookie = cookie;
        updateAuthenHeader(res.data.data.token);
        const user =  await getUserByEmail(values.email, res.data.data.token)
        storageService.set('user', user)
        navigate('/');
        toast.success('Login successfully!');
      } catch (error) {
        // formik.setFieldError('password', 'Incorrect password');
        console.log(error);
        toast.error(error.response.data.data.message);
      }
    },
  });

  const getUserByEmail = async (email, token) => {
    const res = await axiosInstance.get('/user/getUser', {
      params: {
        email
      }
    })

    let plantName = null;
    let teamName = null;

    if(res.data.data.plantId) {
      plantName = (await axiosInstance.get('/plant/getName', {
        params: {
          plantId: res.data.data.plantId
        }
      })).data.data.name
    }

    if(res.data.data.teamId) {
      teamName = (await axiosInstance.get('/team/getName', {
        params: {
          teamId: res.data.data.teamId
        }
      })).data.data.name
    }

    return {...res.data.data, plantName, teamName};
  }

  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <Toaster position='top-center' />
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
          <Button color="light">Sign up</Button>
        </Link>
      </form>
    </div>
  );
}
