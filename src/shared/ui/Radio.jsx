import React from 'react';
import { tv } from 'tailwind-variants';

export default function Radio(props) {
  const {
    value,
    onChange,
    name,
    checked = false,
    color = 'primary',
    disabled = false,
    id = '',
    htmlFor,
  } = props;

  const checkbox = tv({
    base: 'w-6 h-6 rounded-full flex items-center justify-center cursor-pointer',
    variants: {
      color: {
        primary: 'text-white bg-white',
        secondary: 'bg-purple-500 text-white',
        flat: 'bg-f-flat ',
      },
      checked: {
        true: '',
        false: '',
      },
    },
    compoundVariants: [
      {
        checked: [true, false],
        class: 'border',
      },
      {
        checked: true,
        color: 'primary',
        class: 'bg-f-primary',
      },
    ],
    defaultVariants: {
      color: 'primary',
      checked: false,
    },
  });

  const inner = tv({
    base: 'w-2 h-2 bg-white rounded-full',
    variants: {
      checked: {
        true: '',
        false: 'hidden',
      },
    },
  });

  return (
    <label className={checkbox({ color, checked })} htmlFor={htmlFor}>
      <div className={inner({ checked })}></div>
      <input
        id={id}
        value={value}
        onChange={onChange}
        name={name}
        type="radio"
        hidden
        className="justify-center"
      />
    </label>
  );
}
