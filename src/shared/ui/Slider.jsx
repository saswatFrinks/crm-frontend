import React from 'react';
import { Slider as TailwindSlider } from '@material-tailwind/react';
import Input from './Input';

export default function Slider({ title, id = 'range', value, setValue, toFixed = 2 }) {
  return (
    <div className="flex w-full max-w-2xl items-center gap-4">
      {title && (
        <label
          htmlFor={id}
          className=" block basis-44 text-[16px] font-semibold  text-gray-900 dark:text-white"
        >
          {title}
        </label>
      )}
      <TailwindSlider
        value={value} 
        onChange={(e) => { setValue(Number(e.target.value).toFixed(toFixed)) }}
        max={1}
      />
      <Input 
        className="font-semibold"
        value={Number(value)}
        onChange={(e) => {
          const newValue = Number(e.target.value);
          if(newValue.toFixed(toFixed) == Number(value).toFixed(toFixed))return;
          setValue(newValue > 1 ? 1 : newValue.toFixed(toFixed))
        }}
        min={0}
        max={1}
        step={Math.pow(10, -toFixed)}
        type="number"
      />
    </div>
  );
}
