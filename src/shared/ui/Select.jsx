import { tv } from 'tailwind-variants';

export default function Select({ size, placeholder, ...props }) {
  const { options = [] } = props;

  const select = tv({
    base: 'block w-full rounded-lg border text-gray-300 border-gray-300 bg-white  text-sm text-gray-900 focus:border-f-primary focus:ring-f-primary focus-visible:border-f-primary focus-visible:outline-f-primary',
    variants: {
      size: {
        xs: 'p-1',
        sm: 'p-2.5',
      },
    },
    defaultVariants: {
      size: 'sm',
    },
  });
  return (
    <select className={select({ size })}>
      <option value="" disabled selected hidden>
        {placeholder}
      </option>
      {options.map((t) => (
        <option key={t} value={t}>
          {t}
        </option>
      ))}
    </select>
  );
}
