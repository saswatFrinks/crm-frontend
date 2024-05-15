import React, { useEffect } from 'react';
import logo from '@/assets/logo.svg';
import Label from '@/shared/ui/Label';
import Input from '@/shared/ui/Input';
import Button from '@/shared/ui/Button';
import { Link } from 'react-router-dom';
import FPhoneInput from '@/shared/ui/PhoneInput';
import authService from '../auth.service';
import toast, { Toaster } from 'react-hot-toast';
import { useFormik } from 'formik';
import { formatPhoneNumber } from 'react-phone-number-input';
import Modal from '@/shared/ui/Modal';
import SignUpSuccess from './SignUpSuccess';
import { useSetRecoilState } from 'recoil';
import { modalAtom } from '@/shared/states/modal.state';

export default function Register() {

  const [phone, setPhone] = React.useState(undefined);
  const setOpen = useSetRecoilState(modalAtom);

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: '',
      organization: '',
      rePassword: '',
      phone: '',
    },
    validate: (values) => {
      const errors = {};

      if(formik.touched.name){
        if (!values.name) {
          errors.name = 'Name is required';
        } else if (!/^[a-zA-Z\s]*$/.test(values.name)) {
          errors.name = 'Enter name without numeric or special characters.';
        }
      }

      if(formik.touched.password){
        if (!values.password) {
          errors.password = 'Password is required';
        } else if (values.password.length < 6) {
          errors.password = 'Password must be at least 6 characters';
        }
      }

      if(formik.touched.email){
        if (!values.email) {
          errors.email = 'Email is required';
        } else if (
          !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
        ) {
          errors.email = 'Enter a valid email id';
        }
      }

      if(formik.touched.rePassword){
        if (!values.rePassword) {
          errors.rePassword = 'Enter your password again';
        } else if (values.password !== values.rePassword) {
          errors.rePassword = 'Your password not match';
        }
      }

      if(formik.touched.organization){
        if (!values.organization) {
          errors.organization = 'Organization is required';
        }
      }

      return errors;
    },
    onSubmit: async (values) => {
      if(!phone) return;
      const { rePassword, ...value } = values;
      try {
        let number = formatPhoneNumber(phone).replace(/\s/g, '');

        if (number[0] === '0') {
          number = number.slice(1);
        }
        await authService.create({ ...value, phone: number });
        toast.success('Registered successfully!');
        setOpen(true);
      } catch (error) {
        console.log(error);
        toast.error(error.response.data.data.message);
      }
    },
  });

  const getPhoneErrorMessage = () => {
    if (formik.touched.phone && !phone) {
      return 'Contact number is required';
    }
    let number = formatPhoneNumber(phone).replace(/\s/g, '');

    if (number[0] === '0') {
      number = number.slice(1);
    }

    if (formik.touched.phone && phone && number.length !== 10) {
      return 'Contact  number should be 10 digit number';
    }
    return null;
  };

  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <Toaster position='top-center'/>
      <Modal>
        <SignUpSuccess />
      </Modal>
      <img src={logo} alt="logo" className="mb-8" />

      <div className="flex  flex-col gap-6 rounded-lg border-[1px] border-gray-500  bg-white p-6 shadow ">
        <h1 className=" text-center text-4xl font-bold">
          Welcome to Frinks AI!
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
                defaultCountry="IN"
                placeholder="Enter your contact number"
                name="phone"
                onChange={setPhone}
                onBlur={formik.handleBlur}
                value={phone}
                errorMessage={getPhoneErrorMessage()}
              />
            </div>

            <div className="md:min-w-8">
              <Label>Enter Password</Label>
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
            className=" block min-w-[180px]  place-self-end"
          >
            <Button color='light'>Cancel</Button>
          </Link>

          <div className=" min-w-[180px] place-self-start ">
            <Button type="submit" onClick={formik.handleSubmit}>
              Sign up
            </Button>
          </div>
        </form>
        <p className="text-center">
          You can later add more users in Teams & Users Section
        </p>
      </div>
    </div>
  );
}
