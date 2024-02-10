import { tv } from 'tailwind-variants';

export default function Button({
  children,
  size = 'sm',
  color = 'primary',
  fullWidth = true,
  ...props
}) {
  const button = tv(
    {
      base: 'font-medium bg-blue-500 text-white rounded-full active:opacity-80',
      variants: {
        color: {
          primary: 'bg-f-primary text-white',
          secondary: 'bg-purple-500 text-white',
          flat: 'bg-f-flat text-f-primary',
        },
        size: {
          xs: 'text-sm py-2',
          sm: 'text-base py-2.5',
          md: 'text-lg py-3',
          lg: 'text-lg py-4',
        },
        fullWidth: {
          true: 'w-full',
        },
      },
      compoundVariants: [
        {
          size: ['sm', 'md', 'lg', 'xs'],
          class: 'px-4',
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
    <button type="button" className={button({ size, color })} {...props}>
      {children}
    </button>
  );
}
