import { lightColors } from '@/core/constants/colors';
import { getRandomHexColor } from '@/util/util';
import { tv } from 'tailwind-variants';

export default function Chip({ color, children }) {
  const chip = tv({
    base: 'inline-flex px-2 text-sm py-0.5  rounded-xl text-black',
    variants: {
      color: lightColors
    },
    defaultVariants: {
      color: 'color-1',
    },
  });
  return <div className={chip({ color })}>{children}</div>;
}
