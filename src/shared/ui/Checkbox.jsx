import React from 'react';
import { tv } from 'tailwind-variants';
import { FaCheck } from 'react-icons/fa';

export default function Checkbox(props) {
  const { checked = true, htmlFor, ...rest } = props;

  const checkbox = tv({
    base: 'border rounded-md w-6 flex items-center justify-center h-6',
    variants: {
      checked: {
        true: 'bg-f-primary',
        false: '',
      },
    },
  });

  return (
    <label className={checkbox({ checked })} htmlFor={htmlFor}>
      {checked ? <FaCheck className="text-white" size={12} /> : null}
      <input type="checkbox" hidden {...rest} checked></input>
    </label>
  );
}
