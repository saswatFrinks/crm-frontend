import { tv } from 'tailwind-variants';

export default function Chip({ color, children }) {
  const chip = tv({
    base: 'inline-flex px-2 text-sm py-0.5  rounded-xl text-black',
    variants: {
      color: {
        'color-1': 'bg-[#9BDCFD]',
        'color-2': ' bg-[#FFD188]',
        'color-3': 'bg-[#7DDE86]',
        'color-4': 'bg-[#FF9898]',
        'color-5': 'bg-[#C6C4FF]',
        'color-6': 'bg-[#8D1831]',
        'color-7': 'bg-[#E2FF7B]',
        'color-8': 'bg-[#6CEAE9]',
        'color-9': 'bg-[#FF91C4]',
        'color-10': 'bg-[#705368]',
        'color-11': 'bg-[#3D1959]',
        'color-12': 'bg-[#993ECD]',
        'color-13': 'bg-[#F007D8]',
      },
    },
    defaultVariants: {
      color: 'color-1',
    },
  });
  return <div className={chip({ color })}>{children}</div>;
}
