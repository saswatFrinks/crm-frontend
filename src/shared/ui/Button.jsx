import { tv } from 'tailwind-variants';

export default function Button({
  children,
  size = 'sm',
  color = 'primary',
  fullWidth = true,
  className = '',
  variant = '',
  ...props
}) {
  const button = tv(
    {
      base: 'font-medium bg-blue-500 text-white rounded-full active:opacity-80 select-none',
      variants: {
        color: {
          primary: 'bg-f-primary text-white hover:bg-f-primary/90',
          secondary: 'bg-f-secondary text-white hover:bg-f-secondary/90',
          danger: 'bg-red-500 text-white hover:bg-red-400',
          warn: 'bg-yellow-500 text-white hover:bg-yellow-400',
          success: 'bg-green-500 text-white hover:bg-green-400',
        },
        size: {
          tiny: 'text-sm py-1',
          xs: 'text-sm py-2',
          sm: 'text-base py-2.5',
          md: 'text-lg py-3',
          lg: 'text-lg py-4',
        },
        fullWidth: {
          true: 'w-full',
        },
        variant: {
          flat: 'bg-f-flat hover:bg-f-flat/50 text-f-primary',
          border:
            'bg-transparent border border-f-primary text-f-primary hover:text-white',
        },
      },
      compoundVariants: [
        {
          size: ['sm', 'md', 'lg', 'xs', 'tiny', 'warn', 'succcess'],
          class: 'px-4 duration-100',
        },
        {
          variant: 'border',
          color: 'danger',
          class: 'border-red-500 text-red-500',
        },
      ],
      defaultVariants: {
        size: 'sm',
        color: 'primary',
      },
    },
    {
      responsiveVariants: true,
    }
  );

  return (
    <button
      type="button"
      className={`${button({ size, color, fullWidth, variant })} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}