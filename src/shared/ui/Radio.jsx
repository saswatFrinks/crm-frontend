import React from 'react';
import { tv } from 'tailwind-variants';

export default function Radio(props) {
  const {
    value,
    onClick = null,
    onChange = null,
    name,
    checked = false,
    color = 'primary',
    disabled = false,
    id = '',
    htmlFor,
  } = props;

  const checkbox = tv({
    base: 'w-6 h-6 rounded-full flex items-center justify-center border-[#ccc] cursor-pointer drop-shadow hover:drop-shadow-xl',
    variants: {
      color: {
        primary: 'text-white',
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
        false: '',
      },
    },
  });

  return (
    <label className={checkbox({ color, checked })} htmlFor={htmlFor}>
      <div className={inner()}></div>
      <input
        id={id}
        value={value}
        onClick={onClick}
        onChange={onChange}
        name={name}
        type="radio"
        hidden
        className="justify-center"
        disabled={disabled}
      />
    </label>
  );
}
