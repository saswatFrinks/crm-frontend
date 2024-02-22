import React from 'react';
import { useRecoilValue } from 'recoil';
import { stepAtom } from './state';

export default function TimeLine() {
  const [timelines, setTimelines] = React.useState([
    'Basic',
    'Configuration & Classes',
    'Datasets',
    'Model Configuration',
    'Finish',
  ]);

  const step = useRecoilValue(stepAtom);

  return (
    <div className="relative flex flex-col gap-20">
      <div className="absolute left-2.5 top-0 h-full w-0.5 bg-gray-200">
        <div
          className=" w-full bg-f-primary duration-75"
          style={{ height: `${(100 * (step - 1)) / (timelines.length - 1)}%` }}
        ></div>
      </div>
      {timelines.map((t, i) => (
        <div key={t} className="z-20 flex items-center gap-4 bg-white py-4">
          <div
            className={`h-6 w-6 rounded-full duration-75  ${step >= i + 1 ? 'bg-f-primary' : 'border-[1px] bg-white'}`}
          ></div>
          <span>{t}</span>
        </div>
      ))}
    </div>
  );
}
