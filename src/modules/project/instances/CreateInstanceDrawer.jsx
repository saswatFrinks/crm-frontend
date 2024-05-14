import React from 'react'
import BasicInformation from './steps/BasicInformation';
import ModelSelection from './steps/ModelSelection';
import Finish from './steps/Finish';
import TimeLine from '../ai-training/assembly/TimeLine';
import MapCameraIp from './steps/MapCameraIp';
import CameraConfig from './steps/CameraConfig';
import { useParams } from 'react-router-dom';
import axiosInstance from '@/core/request/aixosinstance';
import toast from 'react-hot-toast';

const CreateInstanceDrawer = ({step, childRefs, handleClose}) => {
  const params = useParams();
  const [project, setProject] = React.useState(null);
  
  const childRef = childRefs[step-1];
  
  const fetchProject = async () => {
    try {
      const res = await axiosInstance.get('/project', {
        params: {
          projectId: params.projectId,
        },
      })
      setProject(res?.data?.data);
    } catch (error) {
      toast.error(error?.response?.data?.data?.message || 'Cannot fetch project details');
    }
  };

  React.useEffect(() => {
    fetchProject()
  }, [])

  const stepObj = {
    1: <BasicInformation project={project} formRef = {childRef} />,
    2: <MapCameraIp formRef = {childRef} />,
    3: <CameraConfig formRef = {childRef} />,
    4: <ModelSelection formRef = {childRef} />,
    5: <Finish formRef = {childRef} handleClose = {handleClose} />,
  };

  return (
    <div className="grid h-full grid-cols-12 gap-4">
      <div className="col-span-3 border-r-[1px] border-gray-300 p-6">
        <TimeLine 
          timelines = {
            ['Basic', 'Map Camera IP', 'Camera Config', 'Model Selection', 'Finish']
          }
          step = {step}
        />
      </div>
      <div className="col-span-9 p-6">{stepObj[step]}</div>
    </div>
  )
}

export default CreateInstanceDrawer
