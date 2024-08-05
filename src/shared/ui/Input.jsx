import { useRef } from 'react';
import { tv } from 'tailwind-variants';

export default function Input({ errorMessage, size, value, className, ...props }) {
  const input = tv({
    base: 'mb-1 rounded-md border w-full outline-1 placeholder:text-gray-400  focus:outline-[2px]',
    variants: {
      errorMessage: {
        true: 'border-red-500 focus:outline-red-500',
        false:
          'focus:border-f-primary focus:outline-f-primary  focus:ring-f-primary focus-visible:outline-f-primary',
      },
      size: {
        xs: 'px-2 py-1',
        sm: 'px-4 py-2.5',
        nopadding: 'py-0 m-0 w-[60px] m-0 px-1'
      },
    },
    defaultVariants: {
      errorMessage: false,
      size: 'sm',
    },
  });

  function disableWheel(e) {
    e.preventDefault();
  }

  const inputRef = useRef(null);

  return (
    <div className="relative">
      <input
        type="text"
        disabled={props?.disabled}
        className={input({ size, errorMessage: '' + Boolean(errorMessage) })}
        placeholder="Placeholder text"
        value={value}
        ref={inputRef}
        onFocus={() => {
          if (inputRef?.current?.type === 'number') {
            inputRef.current.addEventListener("wheel", disableWheel);
          }
        }}
        onBlur={() => {
          if (inputRef?.current?.type === 'number') {
            inputRef.current.removeEventListener("wheel", disableWheel);
          }
        }}
        {...props}
      />
      {errorMessage ? (
        <p className="text-xs text-red-500">{errorMessage}</p>
      ) : null}
    </div>
  );
}