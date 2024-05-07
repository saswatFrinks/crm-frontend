import React from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';
import useClickOutSide from '../hooks/useClickOutside';
import { IoClose } from 'react-icons/io5';
import { modalAtom } from '../states/modal.state';

export default function Modal({ children }) {
  const [open, setOpenModal] = useRecoilState(modalAtom);

  const ref = React.useRef(null);

  // useClickOutSide(ref, () => {
  //   setOpenModal(false);
  // });

  if (!open) return null;

  return (
    <div className="fixed left-0 top-0 z-50 flex h-full w-full items-center justify-center bg-[#E3E5E5]/70">
      <div ref={ref} className="w-full max-w-lg rounded-md bg-white shadow-lg">
        {children}
      </div>
    </div>
  );
}

export function ModalHeader({ children }) {
  const setOpenModal = useSetRecoilState(modalAtom);

  return (
    <div className="flex items-center justify-between border-b-[1px] p-5">
      <h3 className="font-semibold">{children}</h3>
      <IoClose
        size={16}
        className="cursor-pointer"
        onClick={() => setOpenModal(false)}
      />
    </div>
  );
}

export function ModalBody({ children }) {
  return <div className="p-5">{children}</div>;
}

export function ModalFooter({ children }) {
  return <div className="border-t-[1px]  p-5">{children}</div>;
}
