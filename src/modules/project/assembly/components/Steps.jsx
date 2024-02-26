import { ASSEMBLY_STEPS } from '@/core/constants';
import React from 'react';
import { useRecoilValue } from 'recoil';
import { stepAtom } from '../state';

export default function Steps() {
  const step = useRecoilValue(stepAtom);

  return (
    <ul className="relative mx-6 flex justify-between border-b-[1px] border-t-[1px] py-4">
      <div className="absolute left-0 top-6 z-10 h-0.5 w-full   bg-gray-400">
        <div
          className={` h-0.5 bg-f-primary  duration-100`}
          style={{
            width: `${(100 / (ASSEMBLY_STEPS.length - 1)) * step}%`,
          }}
        ></div>
      </div>

      {ASSEMBLY_STEPS.map((t, i) => (
        <li key={t} className="relative z-20 flex flex-col items-center gap-2">
          <div
            className={`absolute top-1 z-10 h-2 w-1/2 bg-white ${i == 0 ? 'left-0' : ''} ${i == ASSEMBLY_STEPS.length - 1 ? 'right-0' : ''}`}
          />
          <div className={`bg-white] z-50 px-4`}>
            <div
              className={` h-5 w-5 rounded-full border   ${step >= i ? 'border-transparent bg-f-primary' : 'border-gray-400 bg-white'}`}
            />
          </div>

          <span>{t}</span>
        </li>
      ))}
    </ul>
  );
}
