import { IoClose } from 'react-icons/io5';
import Button from './Button';

export default function Drawer(props) {
  const { isOpen, handleClose, title, handleSubmit, children } = props;

  return (
    <>
      <div
        className={`fixed left-0 top-0 z-40 flex h-full w-full  bg-[#B4B6B8]/50 duration-200 ${isOpen ? '' : 'hidden opacity-0'}`}
        onClick={handleClose}
      ></div>
      <div
        className={`fixed  top-0 z-50 h-full w-full max-w-3xl bg-white duration-200 ${isOpen ? 'right-0' : '-right-full'}`}
      >
        <div className="flex justify-between border border-b-[1px] px-4 py-2">
          {title}
          <IoClose size={20} className="cursor-pointer" onClick={handleClose} />
        </div>
        <div className="h-[calc(100vh-100px)] overflow-y-auto p-4">
          {children}
        </div>

        <div className=" flex justify-end border-t-[1px] px-4 pt-2">
          <div className="flex w-1/3 items-end justify-end gap-2">
            <Button size="xs" color="flat" onClick={handleClose}>
              Cancel
            </Button>
            <Button size="xs" onClick={handleSubmit}>
              Creat Project
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
