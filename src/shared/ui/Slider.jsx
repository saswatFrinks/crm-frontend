import React from 'react';
import { isSafari } from 'react-device-detect';

export default function Slider({ title, id = 'range' }) {
  const [value, setValue] = React.useState(50);
  return (
    <div className="flex w-full max-w-2xl items-center gap-4">
      <label
        htmlFor={id}
        className=" block basis-44 text-[16px] font-semibold  text-gray-900 dark:text-white"
      >
        {title}
      </label>
      <input
        onChange={(e) => setValue(e.target.value)}
        id={id}
        type="range"
        value={value}
        className={`${
          isSafari ? 'safari' : ''
        } w-1/2 accent-f-primary [&::-webkit-slider-runnable-track]:h-[4px] [&::-webkit-slider-runnable-track]:appearance-none [&::-webkit-slider-runnable-track]:outline-0 [&::-webkit-slider-thumb]:-mt-[6px]`}
      ></input>
      <div className="font-semibold">{value}/100</div>
    </div>
  );
}
