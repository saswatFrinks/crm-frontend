import React from 'react';
import { useRecoilState } from 'recoil';
import { stepAtom } from './state';
import BasicInformation from './BasicInformation';
import Configuration from './Configuration';
import DataSet from './DataSet';
import ModelConfiguration from './ModelConfiguration';
import Finish from './Finish';
import TimeLine from './TimeLine';
import axiosInstance from '@/core/request/aixosinstance';
import toast from 'react-hot-toast';

export default function BuildNTrainDrawer({formRefs, isMoving}) {
  const [step, setStep] = useRecoilState(stepAtom);
  const [loading, setLoading] = React.useState(false);

  const stepObj = {
    1: <BasicInformation setLoading={setLoading} key={0} formRef={formRefs[0]} />,
    2: <Configuration setLoading={setLoading} isMoving={isMoving} key={1} formRef={formRefs[1]} />,
    3: <DataSet setLoading={setLoading} key={2} formRef={formRefs[2]} />,
    4: <ModelConfiguration setLoading={setLoading} key={3} />,
    5: <Finish isMoving={isMoving} setLoading={setLoading} key={4} />,
  };

  const handleNext = () => {
    setStep((t) => {
      if (t == 5) return t;
      return t + 1;
    });
  };

  const handleBack = () => {
    setStep((t) => {
      if (t == 1) return t;
      return t - 1;
    });
  };

  return (
    <div className="grid h-full grid-cols-12 gap-4">
      <div className="col-span-4 border-r-[1px] border-gray-300 p-6 sticky top-0">
        <TimeLine loading={loading} setLoading={setLoading} />
      </div>
      <div className="col-span-8 p-6 overflow-y-auto">{stepObj[step]}</div>
    </div>
  );
}
