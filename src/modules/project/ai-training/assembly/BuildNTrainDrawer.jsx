import Input from '@/shared/ui/Input';
import Label from '@/shared/ui/Label';
import TextArea from '@/shared/ui/TextArea';
import React from 'react';
import { useRecoilState } from 'recoil';
import { stepAtom } from './state';
import BasicInformation from './BasicInformation';
import Configuration from './Configuration';
import DataSet from './DataSet';
import ModelConfiguration from './ModelConfiguration';
import Finish from './Finish';
import TimeLine from './TimeLine';

export default function BuildNTrainDrawer() {
  const [step, setStep] = useRecoilState(stepAtom);
  const [loading, setLoading] = React.useState(false);

  const stepObj = {
    1: <BasicInformation setLoading={setLoading} />,
    2: <Configuration setLoading={setLoading} />,
    3: <DataSet setLoading={setLoading} />,
    4: <ModelConfiguration setLoading={setLoading} />,
    5: <Finish setLoading={setLoading} />,
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
      <div className="col-span-4 border-r-[1px] border-gray-300 p-6">
        <TimeLine loading={loading} setLoading={setLoading} />
      </div>
      <div className="col-span-8 p-6">{stepObj[step]}</div>
    </div>
  );
}
