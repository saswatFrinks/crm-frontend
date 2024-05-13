import React from 'react'
import BasicInformation from './BasicInformation';
import ModelSelection from './ModelSelection';
import Finish from './Finish';
import TimeLine from '../ai-training/assembly/TimeLine';
import MapCameraIp from './MapCameraIp';
import CameraConfig from './CameraConfig';
import { useParams } from 'react-router-dom';
import axiosInstance from '@/core/request/aixosinstance';
import toast from 'react-hot-toast';

const CreateInstanceDrawer = ({step}) => {
  const params = useParams();
  const [project, setProject] = React.useState(null);

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
    1: <BasicInformation project={project} />,
    2: <MapCameraIp />,
    3: <CameraConfig />,
    4: <ModelSelection />,
    5: <Finish />,
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
