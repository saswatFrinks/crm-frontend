import React from 'react';
import { useRecoilState } from 'recoil';
import { modalAtom } from '../states/modal.state';
import useClickOutSide from '../hooks/useClickOutside';

export default function Modal({ children }) {
  const [open, setOpenModal] = useRecoilState(modalAtom);

  const ref = React.useRef(null);

  useClickOutSide(ref, () => setOpenModal(false));

  if (!open) return null;

  return (
    <div className="fixed left-0 top-0 z-50 flex h-full w-full items-center justify-center bg-gray-100/75">
      <div ref={ref}>{children}</div>
    </div>
  );
}
