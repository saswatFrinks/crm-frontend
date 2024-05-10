import axiosInstance from '@/core/request/aixosinstance';
import Input from '@/shared/ui/Input';
import Label from '@/shared/ui/Label';
import Select from '@/shared/ui/Select';
import { getOrganizationId } from '@/util/util';
import { useFormik } from 'formik';
import React, { useEffect, useState } from 'react'

const BasicInformation = ({project}) => {
  const [plants, setPlants] = useState([]);

  const fetchAllPlants = async () => {
    const res = await axiosInstance.get('/plant/getList', {
      params: {
        organizationId: getOrganizationId(),
      },
    });

    setPlants(res.data.data);
  };

  useEffect(() => {
    fetchAllPlants();
  }, [])

  useEffect(() => {
    formik.setValues({
      ...formik.values,
      cameraIps: Array.from({length: project?.cameraCount}, () => '')
    })
  }, [project])

  const getPlantDropDown = () => {
    return [{ id: '', name: 'Select' }, ...plants];
  };

  const formik = useFormik({
    initialValues: {
      instanceName: '',
      plantId: '',
      cameraIps: [],
    },
    validate: (values) => {
      const errors = {};
      

      if (formik.touched.instanceName && !values.instanceName) {
        errors.instanceName = 'Instance Name is required';
      }

      if (formik.touched.plantId && !values.plantId) {
        errors.plantId = 'Plant Name is required';
      }

      values.cameraIps.forEach((ip, index) => {
        if (formik.touched.cameraIps && formik.touched.cameraIps[index] && !ip) {
          errors[`cameraIps.${index}`] = `Camera ${index+1} IP is required`;
        }
      });

      return errors;
    },
    onSubmit: async (values) => {
      try {
        console.log('submit', formik.values)
      } catch (err) {
        toast.error(err.response.data.data.message);
      }
    },
  });

  return (
    <div>
      <h1 className=" text-2xl font-semibold">Basic Information</h1>
      <p className='my-4'>Provide the basic information of the instance you wish to create. An instance allows you to deploy your AI model on the shop floor via Frinks AI Edge Application.</p>
      <p className="my-4">Reach out to Frinks AI technical support team to assist you in this process if required. </p>

      <form onSubmit={formik.handleSubmit} className="flex flex-col gap-4">
        <div>
          <Label>Instance Name</Label>
          <Input
            placeholder="Enter Instance Name"
            type="text"
            name="instanceName"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.instanceName}
            errorMessage={formik.errors.instanceName}
          />
        </div>
        <div>
          <Label>Plant</Label>
          <Select
            options={getPlantDropDown()}
            formik={formik}
            field="plantId"
            errorMessage={formik.errors.plantId}
          />
        </div>
        {formik.values.cameraIps.map((cameraIp, index) => (
          <div key={index}>
            <Label>{`Camera ${index + 1} IP`}</Label>
            <Input
              placeholder={`Enter Camera ${index+1} IP`}
              type="text"
              name={`cameraIps[${index}]`}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik?.values?.cameraIps ? formik?.values.cameraIps[index] : ''}
              errorMessage={formik?.errors[`cameraIps.${index}`]}
              pattern="^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$"
            />
          </div>
        ))}
      </form>
    </div>
  )
}

export default BasicInformation;
