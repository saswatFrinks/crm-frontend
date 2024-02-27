import React from 'react';
import { tv } from 'tailwind-variants';

export default function Box({ active }) {
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
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="4.5" y="4.5" width="23" height="23" stroke="#0E0F0F" />
      <circle cx="4" cy="4" r="4" fill="#0E0F0F" />
      <circle cx="4" cy="28" r="4" fill="#0E0F0F" />
      <circle cx="28" cy="4" r="4" fill="#0E0F0F" />
      <circle cx="28" cy="28" r="4" fill="#0E0F0F" />
    </svg>
  );
}
