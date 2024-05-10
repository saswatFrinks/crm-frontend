import axiosInstance from '@/core/request/aixosinstance';
import Input from '@/shared/ui/Input';
import Label from '@/shared/ui/Label';
import Select from '@/shared/ui/Select';
import { getOrganizationId } from '@/util/util';
import React, { useEffect, useState } from 'react'
import { useRecoilState } from 'recoil';
import { addInstanceAtom } from '../state';

const BasicInformation = ({project, formRef}) => {
  const [plants, setPlants] = useState([]);
  const [addInstance, setAddInstance] = useRecoilState(addInstanceAtom);
  const [formData, setFormData] = React.useState({
    instanceName: addInstance?.basic?.instanceName || '',
    plantId: addInstance?.basic?.plantId || '',
    cameraIps: addInstance?.basic?.cameraIps || []
  })

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
    if(addInstance?.basic?.cameraIps?.length === 0){
      setFormData(prev => {
        const ips = Array.from({length: project?.cameraCount}, () => '');
        return {
          ...prev,
          cameraIps: ips
        }
      })
    }
  }, [project])

  const handleSubmit = () => {
    if(!formData.instanceName || !formData.plantId || formData.cameraIps.some(ip => ip.trim().length === 0)){
      throw new Error('All fields are required')
    }
    setAddInstance({
      ...addInstance,
      basic: formData
    })
  }

  formRef.current = {
    handleSubmit: handleSubmit
  }

  return (
    <div>
      <h1 className=" text-2xl font-semibold">Basic Information</h1>
      <p className='my-4'>Provide the basic information of the instance you wish to create. An instance allows you to deploy your AI model on the shop floor via Frinks AI Edge Application.</p>
      <p className="my-4">Reach out to Frinks AI technical support team to assist you in this process if required. </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <Label>Instance Name</Label>
          <Input
            placeholder="Enter Instance Name"
            type="text"
            name="instanceName"
            onChange={(e) => {
              setFormData(prev => ({
                ...prev,
                instanceName: e.target.value
              }))
            }}
            value={formData.instanceName}
          />
        </div>
        <div>
          <Label>Plant</Label>
          <Select
            placeholder={'Select Plant'}
            options={plants}
            onChange={(e) => {
              setFormData(prev => ({
                ...prev,
                plantId: e.target.value
              }))
            }}
            value = {formData.plantId}
          />
        </div>
        {formData.cameraIps.map((cameraIp, index) => (
          <div key={index}>
            <Label>{`Camera ${index + 1} IP`}</Label>
            <Input
              placeholder={`Enter Camera ${index+1} IP`}
              type="text"
              name={`cameraIps[${index}]`}
              onChange={(e) => {
                setFormData(prev => {
                  const newIps = [...prev.cameraIps];
                  newIps[index] = e.target.value
                  return {
                    ...prev,
                    cameraIps: newIps
                  }
                })
              }}
              value={formData.cameraIps[index] || ''}
              pattern="^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$"
            />
          </div>
        ))}
      </form>
    </div>
  )
}

export default BasicInformation;
