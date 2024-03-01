import React from 'react';
import { tv } from 'tailwind-variants';

export default function Box({ active, size = 'sm' }) {
  const clx = tv({
    base: '',
    variants: {
      active: {
        true: 'text-f-primary',
        false: '',
      },
      size: {
        xs: 'w-4 h-4',
        sm: 'w-6 h-6',
      },
    },
  });
  return (
    <svg
      className={clx({ active, size })}
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
