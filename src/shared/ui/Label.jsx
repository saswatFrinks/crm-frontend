import React from 'react';
import { tv } from 'tailwind-variants';

export default function Label({
  main = true,
  children,
  required = false,
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
    <label className={label({ main })} {...props}>
      {children} <span className="text-red-500">{required ? '*' : null}</span>
    </label>
  );
}
