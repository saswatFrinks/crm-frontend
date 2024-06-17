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
import { useRecoilState } from 'recoil';
import { addInstanceAtom } from './state';
import ProjectCreateLoader from '@/shared/ui/ProjectCreateLoader';

const CreateInstanceDrawer = ({step, childRefs, editInstance = null}) => {
  const params = useParams();
  const [project, setProject] = React.useState(null);
  const [addInstance, setAddInstance] = useRecoilState(addInstanceAtom);
  const [loader, setLoader] = React.useState(false);
  
  const childRef = childRefs[step-1];
  
  const fetchProject = async () => {
    try {
      setLoader(true);
      const res = await axiosInstance.get('/project', {
        params: {
          projectId: params.projectId,
        },
      })
      setProject(res?.data?.data);
    } catch (error) {
      toast.error(error?.response?.data?.data?.message || 'Cannot fetch project details');
    } finally {
      setLoader(false);
    }
  };

  React.useEffect(() => {
    fetchProject()
  }, [])

  React.useEffect(() => {
    if(editInstance){
      setAddInstance({
        ...addInstance,
        instanceId: editInstance?.instances?.id
      })
    }
  }, [editInstance])

  const stepObj = {
    1: <BasicInformation editInstanceId = {editInstance?.instances?.id || null} project={project} formRef = {childRef} />,
    2: <MapCameraIp formRef = {childRef} />,
    3: <CameraConfig formRef = {childRef} configUploaded = {editInstance ? true : false} />,
    4: <ModelSelection project={project} formRef = {childRef} />,
    5: <Finish project={project} formRef = {childRef}/>,
  };

  if(loader)return <ProjectCreateLoader title='Fetching Project Details'/>

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
