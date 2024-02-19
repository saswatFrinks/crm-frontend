import { tv } from 'tailwind-variants';

export default function Input({ errorMessage, size, value, ...props }) {
  const input = tv({
    base: 'mb-1 w-full rounded-md border  outline-1 placeholder:text-gray-400  focus:outline-[2px]',
    variants: {
      errorMessage: {
        true: 'border-red-500 focus:outline-red-500',
        false:
          'focus:border-f-primary focus:outline-f-primary  focus:ring-f-primary focus-visible:outline-f-primary',
      },
      size: {
        xs: 'px-2 py-1',
        sm: 'px-4 py-2.5',
      },
    },
    defaultVariants: {
      errorMessage: false,
      size: 'sm',
    },
  });

  return (
    <div className="relative">
      <input
        type="text"
        className={input({ size, errorMessage: '' + Boolean(errorMessage) })}
        placeholder="Placeholder text"
        value={value}
        {...props}
      />
      {errorMessage ? (
        <p className="text-xs text-red-500">{errorMessage}</p>
      ) : null}
    </div>
  );
}