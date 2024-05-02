import logo from '@/assets/logo.svg';
import Input from '@/shared/ui/Input';
import Label from '@/shared/ui/Label';
import Button from '@/shared/ui/Button';
import { useParams, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import toast from 'react-hot-toast';
import axiosInstance from '@/core/request/aixosinstance';


export default function ResetPassword() {
  const navigate = useNavigate();
  const params = useParams();
  
  const sendApiCall = async () => {
    const {magicId} = params
    const {password} = formik.values
    const {data} = await axiosInstance.post("/user/resetPassword", {
      magicId,
      password
    })
    console.log(data)
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
      console.log(values);
      try {
        await sendApiCall()
        navigate('/login');
        toast.success('Password reset successfully!');
      } catch (error) {
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
      </form>
    </div>
  );
}
