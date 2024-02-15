import React from 'react';
import { tv } from 'tailwind-variants';

export default function Label({
  main = true,
  className = '',
  children,
  ...props
}) {
  const label = tv({
    base: 'inline-block text-black select-none cursor-pointer',
    variants: {
      main: {
        true: 'font-semibold',
      },
    },
  });

  return (
    <label className={`${label({ main })} ${className}`} {...props}>
      {children}
    </label>
  );
}
