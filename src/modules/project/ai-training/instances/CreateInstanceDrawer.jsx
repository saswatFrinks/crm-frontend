import React from 'react'
import BasicInformation from './BasicInformation';
import ModelSelection from './ModelSelection';
import Finish from './Finish';
import TimeLine from '../assembly/TimeLine';
import MapCameraIp from './MapCameraIp';
import CameraConfig from './CameraConfig';

const CreateInstanceDrawer = ({step}) => {

  const stepObj = {
    1: <BasicInformation />,
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
