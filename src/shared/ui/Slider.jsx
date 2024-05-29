import React from 'react';
import { Slider as TailwindSlider } from '@material-tailwind/react';

export default function Slider({ title, id = 'range', value, setValue }) {
  return (
    <div className="flex w-full max-w-2xl items-center gap-4">
      <label
        htmlFor={id}
        className=" block basis-44 text-[16px] font-semibold  text-gray-900 dark:text-white"
      >
        {title}
      </label>
      <TailwindSlider
        value={value} 
        onChange={(e) => { setValue(e.target.value) }}
      />
      <div className="font-semibold">{Math.round(value, 2)}/100</div>
    </div>
  );
}
