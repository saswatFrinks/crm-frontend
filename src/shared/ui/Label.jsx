import React from 'react';
import { tv } from 'tailwind-variants';

export default function Label({ main = true, children, ...props }) {
  const label = tv({
    base: 'mb-2 inline-block text-black select-none cursor-pointer',
    variants: {
      main: {
        true: 'font-semibold',
      },
    },
  });
  return (
    <label className={label({ main })} {...props}>
      {children}
    </label>
  );
}
