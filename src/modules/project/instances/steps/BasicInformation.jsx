import axiosInstance from '@/core/request/aixosinstance';
import Input from '@/shared/ui/Input';
import Label from '@/shared/ui/Label';
import Select from '@/shared/ui/Select';
import { getOrganizationId } from '@/util/util';
import React, { useEffect, useState } from 'react'
import { useRecoilState } from 'recoil';
import { addInstanceAtom } from '../state';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import ProjectCreateLoader from '@/shared/ui/ProjectCreateLoader';

const BasicInformation = ({project, formRef, editInstanceId = null}) => {
  const [plants, setPlants] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loader, setLoader] = useState(false);
  const params = useParams();
  const [addInstance, setAddInstance] = useRecoilState(addInstanceAtom);
  const [formData, setFormData] = React.useState({
    instanceName: addInstance?.basic?.instanceName || '',
    plantId: addInstance?.basic?.plantId || '',
    teamId: addInstance?.basic?.teamId || '',
    cameraIps: addInstance?.basic?.cameraIps || []
  })
  const defaultErrors = {
    instanceName: '',
    plantId: '',
    teamId: '',
    cameraIps: []
  }
  const [errors, setErrors] = useState(defaultErrors)

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
    const teamsFetched = res.data.data;

    setTeams(teamsFetched);
  };

  const fetchCamera = async (instanceId) => {
    try {
      const response = await axiosInstance('/camera/list', {
        params: {
          instanceId: addInstance?.instanceId || instanceId
        }
      });
      
      return await response?.data?.data;
    } catch (error) {
      throw new Error(error);
    }
  }

  const fetchInstanceData = async (instanceId) => {
    try {
      setLoader(true);
      const response = await axiosInstance.get('/instance', {
        params: {
          instanceId
        }
      });

      const data = await response?.data?.data;
      const formDataToEdit = {
        instanceName: data?.instance?.name,
        plantId: data?.instance?.plantId,
        teamId: data?.instance?.teamId,
        cameraIps: data?.cameras
      }
      setAddInstance({
        ...addInstance,
        instanceId: instanceId,
        basic:{
          ...addInstance.basic,
          ...formDataToEdit
        }
      })

      setFormData(formDataToEdit);
    } catch (error) {
      toast.error(error?.response?.data?.data?.message);
    } finally {
      setLoader(false);
    }
  }

  useEffect(() => {
    fetchAllPlants();
    fetchAllTeams();
  }, [])

  useEffect(() => {
    if(editInstanceId){
      fetchInstanceData(editInstanceId);
    }
  }, [editInstanceId])

  useEffect(() => {
    if(addInstance?.instanceId){
      const formDataToEdit = {
        instanceName: addInstance?.basic?.instanceName,
        plantId: addInstance?.basic?.plantId,
        teamId: addInstance?.basic?.teamId,
        cameraIps: addInstance?.basic?.cameraIps
      }
      setFormData(formDataToEdit)
    }
  }, [addInstance])

  useEffect(() => {
    if(addInstance?.basic?.cameraIps?.length === 0){
      setFormData(prev => {
        const ips = Array.from({length: project?.cameraCount}, () => ({cameraIp: '', id: null}));
        return {
          ...prev,
          cameraIps: ips
        }
      });
      setErrors(prev => {
        const ipErrors = Array.from({length: project?.cameraCount}, () => (''));
        return {
          ...prev,
          cameraIps: ipErrors
        }
      })
    }
  }, [project])

  const validateForm = () => {
    const errors = defaultErrors;
    errors.cameraIps = [...errors.cameraIps];
    if(!formData.instanceName){
      errors.instanceName = 'Instance name is required'
    }
    if(!formData.plantId){
      errors.plantId = 'Plant Name is required'
    }
    if(!formData.teamId){
      errors.teamId = 'Team name is required'
    }
    formData.cameraIps.forEach((ip, index) => {
      if(!ip.cameraIp){
        errors.cameraIps[index] = `Camera IP ${index+1} is required`
      }
    })
    return errors;
  }

  const hasErrors = (errors) => {
    if(Object.values(errors).some(error => error.length > 0))return true;
    if(errors?.cameraIps?.some(error => error.length > 0))return true;
    return false;
  }

  const handleSubmit = async () => {
    try {
      const errors = validateForm();
      setErrors(errors);
      setLoader(true);
      // if(!formData.instanceName || !formData.plantId || formData.cameraIps.some(ip => ip.cameraIp.trim().length === 0) || hasErrors(errors)){
      //   throw new Error('All fields are required')
      // }
      if(hasErrors(errors))return null;
      let data = {
        name: formData.instanceName,
        projectId: params.projectId,
        plantId: formData.plantId,
        cameraIps: formData.cameraIps?.map(ip => ({cameraIp: ip.cameraIp, id: ip.id})),
        teamId: formData.teamId,
      }
      if(addInstance?.instanceId || editInstanceId){
        data = {
          ...data,
          instanceId: addInstance?.instanceId || editInstanceId
        }
      }
      const response = await axiosInstance.post('/instance', data);
      const instanceId = (addInstance?.instanceId || editInstanceId) ?? await response?.data?.data?.id;
      const selectedIps = await fetchCamera(instanceId);

      setAddInstance({
        ...addInstance,
        basic: {
          ...formData,
          plantName: plants.find(plant => plant?.id === formData?.plantId)?.name,
          cameraIps: selectedIps
        },
        instanceId
      });
    } catch (error) {
      let errorMessage = error?.response ? error?.response?.data?.data?.details : error?.message;
      const regex = /"cameraIps\[(\d+)\].cameraIp" must be a valid ip address/;
      const match = errorMessage?.match(regex);
      if (match) {
        const cameraIndex = parseInt(match[1], 10) + 1;
        errorMessage = errorMessage?.replace(`"cameraIps[${match[1]}].cameraIp"`, `Camera IP ${cameraIndex}`);
      }
      throw new Error(errorMessage)
    } finally {
      setLoader(false);
    }
  }

  formRef.current = {
    handleSubmit: handleSubmit
  }

  if(loader){
    return <ProjectCreateLoader title='Loading...' />
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
              setErrors(error => {
                const newErrors = {...error};
                newErrors.instanceName = e.target.value ? '' : 'Instance name is required';
                return newErrors;
              })
            }}
            value={formData.instanceName}
            errorMessage={errors.instanceName}
          />
        </div>
        <div>
          <Label>Plant</Label>
          <Select
            disabled={editInstanceId ? true : false}
            placeholder={'Select Plant'}
            options={plants}
            onChange={(e) => {
              setFormData(prev => ({
                ...prev,
                plantId: e.target.value
              }))
              setErrors(error => {
                const newErrors = {...error};
                newErrors.plantId = e.target.value ? '' : 'Plant name is required';
                return newErrors;
              })
            }}
            value = {formData.plantId}
            errorMessage={errors.plantId}
          />
        </div>
        <div>
          <Label>Team</Label>
          <Select
            disabled={editInstanceId ? true : false}
            placeholder={'Select Team'}
            options={teams}
            onChange={(e) => {
              setFormData(prev => ({
                ...prev,
                teamId: e.target.value
              }))
              setErrors(error => {
                const newErrors = {...error};
                newErrors.teamId = e.target.value ? '' : 'Team name is required';
                return newErrors;
              })
            }}
            value = {formData.teamId}
            errorMessage={errors.teamId}
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
                  newIps[index] = {
                    ...newIps[index],
                    cameraIp: e.target.value
                  }
                  return {
                    ...prev,
                    cameraIps: newIps
                  }
                })
                setErrors(error => {
                  const newErrors = [...error.cameraIps];
                  newErrors[index] = e.target.value ? '' : `Camera IP ${index+1} is required`;
                  return {
                    ...error,
                    cameraIps: newErrors
                  };
                })
              }}
              value={formData.cameraIps[index]?.cameraIp || ''}
              pattern="^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$"
              errorMessage={errors.cameraIps[index]}
            />
          </div>
        ))}
      </form>
    </div>
  )
}

export default BasicInformation;
