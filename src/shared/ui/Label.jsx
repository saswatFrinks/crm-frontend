import React from 'react';

export default function Label({ children, ...props }) {
  return (
    <label className="mb-2 inline-block font-semibold text-black" {...props}>
      {children}
    </label>
  );
}
