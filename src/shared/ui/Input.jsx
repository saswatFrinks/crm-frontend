import React from 'react';

export default function Input({ ...props }) {
  return (
    <div className="relative">
      <input
        type="text"
        id="default-search"
        className=" w-full rounded-md border px-4 py-2.5 outline-1 placeholder:text-gray-400 focus:border-f-primary focus:outline-[2px] focus:outline-f-primary  focus:ring-f-primary focus-visible:outline-f-primary"
        placeholder="Placeholder text"
        required=""
        {...props}
      />
    </div>
  );
}
