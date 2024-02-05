import React from 'react';
import logo from '@/assets/logo.svg';
import Label from '@/shared/ui/Label';
import Input from '@/shared/ui/Input';
import Button from '@/shared/ui/Button';
import { Link, useNavigate } from 'react-router-dom';
import FPhoneInput from '@/shared/ui/PhoneInput';
import authService from '../auth.service';
import toast from 'react-hot-toast';
import { useFormik } from 'formik';

export default function Register() {
  const navigate = useNavigate();

  const [phone, setPhone] = React.useState(undefined);

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: '',
      organization: '',
      rePassword: '',
    },
    validate: (values) => {
      const errors = {};

      if (!values.name) {
        errors.name = 'Name is required';
      }

      if (!values.password) {
        errors.password = 'Password is required';
      }

      if (!values.email) {
        errors.email = 'Email is required';
      } else if (
        !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
      ) {
        errors.email = 'Enter a valid email id';
      }

      if (!values.rePassword) {
        errors.rePassword = 'Enter your password again';
      } else if (values.password !== values.rePassword) {
        errors.rePassword = 'Your password not match';
      }

      if (!values.organization) {
        errors.organization = 'Organization is required';
      }

      return errors;
    },
    onSubmit: async (values) => {
      if (!phone) return;
      const { rePassword, ...value } = values;
      try {
        await authService.create({ ...value, phone: phone.slice(1) });
        toast.success('Register successfully!');
        navigate('/login');
      } catch (error) {
        console.log(error);
        toast.error(error.response.data.data.details);
      }
    },
  });

  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <img src={logo} alt="logo" className="mb-8" />

      <div className="flex  flex-col gap-6 rounded-lg border-[1px] border-gray-500  bg-white p-6 shadow ">
        <h1 className=" text-center text-4xl font-bold">
          Welcome to Frinks AI
        </h1>

        <p className="text-center text-2xl font-semibold">Sign up</p>

        <form className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="col-span-2 grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="md:min-w-80">
              <Label>User Name</Label>
              <Input
                placeholder="Enter your name"
                type="text"
                name="name"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.name}
                errorMessage={formik.errors.name}
              />
            </div>

            <div className="md:min-w-8">
              <Label>User Email Id</Label>
              <Input
                placeholder="Enter your email"
                type="email"
                name="email"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.email}
                errorMessage={formik.errors.email}
              />
            </div>

            <div className="md:min-w-8">
              <Label>Organisation Name</Label>
              <Input
                placeholder="Enter your organisation name"
                name="organization"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.organization}
                errorMessage={formik.errors.organization}
              />
            </div>

            <div className="md:min-w-8">
              <Label>Contact number</Label>
              <FPhoneInput
                defaultCountry="US"
                placeholder="Enter yout contact number"
                name="phone"
                onChange={setPhone}
                value={phone}
                errorMessage={!phone ? 'Phone number is required' : null}
              />
            </div>

            <div className="md:min-w-8">
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

            <div className="md:min-w-8">
              <Label>Confirm Password</Label>
              <Input
                placeholder="Re-enter password"
                type="password"
                name="rePassword"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.rePassword}
                errorMessage={formik.errors.rePassword}
              />
            </div>
          </div>

          <Link
            to={'/login'}
            className=" block min-w-[180px]  place-self-end   "
          >
            <Button color="flat">Cancel</Button>
          </Link>

          <div className=" min-w-[180px] place-self-start ">
            <Button type="submit" onClick={formik.handleSubmit}>
              Sign up
            </Button>
          </div>
        </form>
        <p className="text-center">
          You can latter add more users in Teams & Users Section
        </p>
      </div>
    </div>
  );
}
