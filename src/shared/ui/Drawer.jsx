import { IoClose } from 'react-icons/io5';
import { tv } from 'tailwind-variants';

export default function Drawer(props) {
  const { isOpen, handleClose, title, children, footer = null, size, scrollRef = null } = props;

  const backdrop = tv({
    base: 'fixed left-0 top-0 z-40 flex h-full w-full  bg-[#B4B6B8]/50 duration-200',
    variants: {
      isOpen: {
        false: 'hidden opacity-0',
      },
    },
  });

  const container = tv({
    base: 'fixed top-0 z-50 h-full w-full bg-white duration-200',
    variants: {
      isOpen: {
        true: 'right-0',
        false: '-right-full',
      },
      size: {
        '7xl': 'max-w-7xl',
        '6xl': 'max-w-6xl',
        xl: 'max-w-5xl',
        lg: 'max-w-4xl',
        md: 'max-w-3xl',
        sm: 'max-w-xl',
        xs: 'max-w-lg',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  });

  return (
    <>
      <div className={backdrop({ isOpen })} onClick={handleClose}></div>
      <div className={container({ isOpen, size })}>
        <div className="flex justify-between border border-b-[1px] px-4 py-2 font-semibold">
          {title}
          <IoClose size={20} className="cursor-pointer" onClick={handleClose} />
        </div>
        <div className="h-[calc(100vh-100px)] overflow-y-auto p-4" ref={scrollRef}>
          {children}
        </div>

        <div className=" flex justify-end border-t-[1px] px-4 pt-2">
          {footer}
        </div>
      </div>
    </>
  );
}
