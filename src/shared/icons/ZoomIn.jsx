import React from 'react';
import { tv } from 'tailwind-variants';

export default function ZoomIn({ active = false }) {
  const clx = tv({
    base: 'w-6 h-6',
    variants: {
      active: {
        true: 'text-f-primary',
        false: '',
      },
    },
  });

  return (
    <svg
      className={clx({ active })}
      viewBox="0 0 26 26"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M25 25L19.2 19.2M11.6667 7.66667V15.6667M7.66667 11.6667H15.6667M22.3333 11.6667C22.3333 17.5577 17.5577 22.3333 11.6667 22.3333C5.77563 22.3333 1 17.5577 1 11.6667C1 5.77563 5.77563 1 11.6667 1C17.5577 1 22.3333 5.77563 22.3333 11.6667Z"
        stroke="#0E0F0F"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}