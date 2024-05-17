import React from 'react'
import logo from '@/assets/logo.svg';
import Label from '@/shared/ui/Label';
import Input from '@/shared/ui/Input';
import Button from '@/shared/ui/Button';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import axiosInstance from '@/core/request/aixosinstance';
import MessageComponent from '../MessageComponent';

const ForgotPassword = () => {
  const [email, setEmail] = React.useState('');
  const [error, setError] = React.useState('');
  const [linkSent, setLinkSent] = React.useState(false);
  const [loader, setLoader] = React.useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(error || !email){
      setError('Email ID is required');4
      return;
    }else{
      setError('');
    }
    try{
      setLoader(true);
      const response = await axiosInstance.post('/user/generate-reset-password', {
        email
      });
      
      setLinkSent(response?.data?.success);
    } catch (error) {
      toast.error(error?.response?.data?.data?.message);
    } finally {
      setLoader(false);
    }
  }

  const onChangeEmail = (e) => {
    const enteredEmail = e.target.value;
    const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{1,}\b/;
    const isValid = emailRegex.test(enteredEmail);
    if(!isValid || !enteredEmail){
      setError('Please Enter a Valid Email ID');
    }else{
      setError('');
    }
    setEmail(enteredEmail);
  }

  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <img src={logo} alt="logo" className="mb-8" />

      {linkSent ? (
        <MessageComponent 
          description={`The link to reset the password has been sent to the email ID: '${email}'.`}
          to={null}
        />
      ) : (
        <form
          onSubmit={handleSubmit}
          className="flex max-w-sm flex-col gap-4 rounded-lg border-[1px] border-gray-500  bg-white p-6 shadow"
        >
          <h1 className=" text-center text-2xl font-bold">Forgot Password</h1>

          <div>
            <Label>Email ID</Label>
            <Input
              placeholder="Enter Email ID"
              type="email"
              name="emailId"
              value={email}
              onChange={onChangeEmail}
              errorMessage={error}
            />
          </div>

          <Button type="submit" disabled={loader}>
            {loader ? 'Loading...' : 'Send'}
          </Button>
          <Button color='light' 
            onClick = {() => navigate(-1)}
          >
            Cancel
          </Button>
        </form>
      )}
    </div>
  )
}

export default ForgotPassword
