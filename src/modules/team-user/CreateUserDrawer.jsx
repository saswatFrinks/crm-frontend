import Input from '@/shared/ui/Input';
import Label from '@/shared/ui/Label';
import FPhoneInput from '@/shared/ui/PhoneInput';
import Select from '@/shared/ui/Select';
import { useFormik } from 'formik';
import React from 'react';
import toast from 'react-hot-toast';
import { formatPhoneNumber } from 'react-phone-number-input';
import axiosInstance from '@/core/request/aixosinstance';
import { getOrganizationId } from '@/util/util';

const CreateUserDrawer = React.forwardRef((props, ref) => {
  const { closeDrawer, fetchAllUsers } = props;
  const [phone, setPhone] = React.useState(undefined);
  const [plants, setPlants] = React.useState([]);
  const [teams, setTeams] = React.useState([]);

  const fetchAllPlants = async () => {
    const res = await axiosInstance.get('/plant/getList', {
      params: {
        organizationId: getOrganizationId(),
      },
    });
    setPlants(res.data.data);
  };

  const fetchAllTeams = async () => {
    const res = await axiosInstance.get('/team/getList', {
      params: {
        organizationId: getOrganizationId(),
      },
    });

    setTeams(res.data.data);
  };

  React.useEffect(() => {
    fetchAllPlants();
    fetchAllTeams();
  }, []);

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      plantId: '',
      teamId: '',
    },
    validate: (values) => {
      const errors = {};

      if (!values.name) {
        errors.name = 'Name is required';
      } else if (!/^[a-zA-Z\s]*$/.test(values.name)) {
        errors.name = 'Enter name without numeric or special characters.';
      }

      if (!values.email) {
        errors.email = 'Email is required';
      } else if (
        !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
      ) {
        errors.email = 'Enter a valid email id';
      }

      return errors;
    },
    onSubmit: async (values) => {
      try {
        const userJson = createUserJson(values);
        await axiosInstance.post('/user/create', userJson);

        closeDrawer();
        fetchAllUsers();
      } catch (error) {
        console.log(error);
        toast.error(error.response.data.data.details);
      }
    },
  });

  const createUserJson = (values) => {
    let number = formatPhoneNumber(phone).replace(/\s/g, '');

    if (number[0] === '0') {
      number = number.slice(1);
    }

    const user = {
      name: values.name,
      email: values.email,
      phone: number,
      organizationId: getOrganizationId()
    };

    if(values.plantId) {
      user['plantId'] = values.plantId;
    }

    if(values.teamId) {
      user['teamId'] = values.teamId;
    }

    return user;
  };

  const getPhoneErrorMessage = () => {
    if (formik.dirty && !phone) {
      return 'Phone number is required';
    }

    let number = formatPhoneNumber(phone).replace(/\s/g, '');

    if (number[0] === '0') {
      number = number.slice(1);
    }

    if (formik.dirty && phone && number.length !== 10) {
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

        <Select
          options={[{ id: '', name: 'Select' }, ...plants]}
          field="plantId"
          formik={formik}
        />
      </div>

      <div>
        <Label>Team</Label>

        <Select
          options={[{ id: '', name: 'Select' }, ...teams]}
          field="teamId"
          formik={formik}
        />
      </div>
    </div>
  );
});

CreateUserDrawer.displayName = 'CreateuserDrawer';
export default CreateUserDrawer;
