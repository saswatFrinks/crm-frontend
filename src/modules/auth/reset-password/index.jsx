import logo from '@/assets/logo.svg';
import Input from '@/shared/ui/Input';
import Label from '@/shared/ui/Label';
import Button from '@/shared/ui/Button';
import { useNavigate, useParams } from 'react-router-dom';
import { useFormik } from 'formik';
import toast, { Toaster } from 'react-hot-toast';
import axiosInstance from '@/core/request/aixosinstance';
import { useEffect, useState } from 'react';
import ProjectCreateLoader from '@/shared/ui/ProjectCreateLoader';
import MessageComponent from '../MessageComponent';

export default function ResetPassword() {
  const params = useParams();
  const navigate = useNavigate();

  const [validityLoader, setValidityLoader] = useState(true);
  const [resetLoader, setResetLoader] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const getMagicInfo = async () => {
    try {
      setValidityLoader(true);
      const response = await axiosInstance.get(`/magic/${params.magicId}`);
      setIsValid(response?.data?.data?.valid ?? false);
    } catch(error) { 
      toast.error(error?.response?.data?.data?.message)
    } finally {
      setValidityLoader(false);
    } 
  }
  
  const formik = useFormik({
    initialValues: {
      password: '',
      verifyPassword: '',
    },
    validate: (values) => {
      const errors = {};

      if (!values.password) {
        errors.password = 'Password is required';
      } else if (values.password.length < 6) {
        errors.password = 'Password must be at least 6 characters long';
      }else if(values.verifyPassword!=values.password){
        errors.verifyPassword = 'Passwords do not match'
      }

      return errors;
    },
    onSubmit: async (values) => {
      try {
        setResetLoader(true);
        const response = await axiosInstance.post('/user/reset-password', {
          magicId: params.magicId,
          password: values?.password
        });
        
        if(response?.data?.success){
          setIsSuccess(true);
          setIsValid(false);
        }
      } catch(error) {
        toast.error(error?.response?.data?.data?.message);
        setError(error?.response?.data?.data?.message)
      } finally {
        setResetLoader(false);
      }
    },
  });

  useEffect(() => {
    getMagicInfo()
  }, [])

  if(validityLoader){
    return <ProjectCreateLoader title='Checking Validity' />
  }

  if(resetLoader){
    return <ProjectCreateLoader title='Reseting password' />
  }

  if(error){
    return <MessageComponent
      description={error}
      to={null}
    />
  }

  return (
    <div className="flex h-screen flex-col items-center justify-center mx-2">
      <Toaster position='top-center'/>
      <img src={logo} alt="logo" className="mb-8" />

      {isValid ? (
        <form
          onSubmit={formik.handleSubmit}
          className="flex max-w-sm flex-col gap-4 rounded-lg border-[1px] border-gray-500  bg-white p-6 shadow"
        >
          <h1 className=" text-center text-4xl font-bold">Reset password</h1>

          <p className="text-center">
            Enter a new password
          </p>

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

          <div>
            <Label>Verify password</Label>
            <Input
              placeholder="Re-enter password"
              type="password"
              name="verifyPassword"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.verifyPassword}
              errorMessage={formik.errors.verifyPassword}
            />
          </div>

          <Button type="submit">Confirm</Button>
          <Button 
            color='light'
            onClick={() => navigate('/login')}
          >
            Cancel
          </Button>
        </form>
      ) : (
        <MessageComponent
          description={
            isSuccess ? (
              'Password reset successful. Please login again.'
            ) : (
              'The reset password link has expired. Please try to generate a new reset password link.'
            )}
          to={
            isSuccess ? '/login' : '/forgot-password'
          }
        />
      )}
    </div>
  );
}
