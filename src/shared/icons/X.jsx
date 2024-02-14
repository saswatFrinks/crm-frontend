import React from 'react';

export default function X(props) {
  return (
    <svg
      {...props}
      className='cursor-pointer'
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M11 1L1 11M1 1L11 11"
        stroke="#0E0F0F"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
