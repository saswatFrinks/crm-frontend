import Input from '@/shared/ui/Input';
import Label from '@/shared/ui/Label';
import FPhoneInput from '@/shared/ui/PhoneInput';
import Select from '@/shared/ui/Select';
import { useFormik } from 'formik';
import React from 'react';
import toast from 'react-hot-toast';

const CreateUserDrawer = React.forwardRef((props, ref) => {
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
      } else if (!/^[a-zA-Z\s]*$/.test(values.name)) {
        errors.name = 'Enter name without numeric or special characters.';
      }

      if (!values.password) {
        errors.password = 'Password is required';
      } else if (values.password.length < 6) {
        errors.password = 'Password must be at least 6 characters';
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
      try {
        console.log(values);
      } catch (error) {
        console.log(error);
        toast.error(error.response.data.data.details);
      }
    },
  });

  const getPhoneErrorMessage = () => {
    if (formik.dirty && !phone) {
      return 'Phone number is required';
    }
    if (formik.dirty && phone && phone.length - 1 !== 10) {
      return 'Contact  number should be 10 digit number';
    }
    return null;
  };

  React.useImperativeHandle(ref, () => ({
    submitForm() {
      formik.handleSubmit();
    },
  }));

  return (
    <div className="flex flex-col gap-4">
      <div className="">
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

      <div className="">
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

      <div className="">
        <Label>Phone number</Label>
        <FPhoneInput
          defaultCountry="US"
          placeholder="Enter your contact number"
          name="phone"
          onChange={setPhone}
          value={phone}
          errorMessage={getPhoneErrorMessage()}
        />
      </div>

      <div>
        <Label>Plant</Label>

        <Select />
      </div>

      <div>
        <Label>Team</Label>

        <Select />
      </div>
    </div>
  );
});

CreateUserDrawer.displayName = 'CreateuserDrawer';
export default CreateUserDrawer;
