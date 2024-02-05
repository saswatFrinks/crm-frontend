import React from 'react';

export default function Input({ error, errorMessage, value, ...props }) {
  return (
    <div className="relative">
      <input
        type="text"
        className={`mb-1 w-full rounded-md border px-4 py-2.5 outline-1 placeholder:text-gray-400  focus:outline-[2px]  ${error ? 'border-red-500' : 'focus:border-f-primary focus:outline-f-primary  focus:ring-f-primary focus-visible:outline-f-primary'}`}
        placeholder="Placeholder text"
        value={value}
        {...props}
      />
      {errorMessage ? (
        <p className="text-xs text-red-500">{errorMessage}</p>
      ) : null}
    </div>
  );
}
