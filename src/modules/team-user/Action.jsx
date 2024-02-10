import React from 'react';
import { HiDotsVertical } from 'react-icons/hi';
import { FaRegTrashCan } from 'react-icons/fa6';
import { FiEdit2 } from 'react-icons/fi';
import useClickOutSide from '@/shared/hooks/useClickOutside';

export default function Action() {
  const [open, setOpen] = React.useState(false);

  const ref = React.useRef(null);

  useClickOutSide(ref, () => setOpen(false));

  return (
    <div className="relative">
      <HiDotsVertical
        size={18}
        className="cursor-pointer"
        onClick={() => setOpen(true)}
      />
      {open && (
        <ul
          className="absolute -left-24 top-0 w-24 rounded-md bg-white shadow-xl"
          ref={ref}
        >
          <li className="flex cursor-pointer items-center gap-2 p-2 hover:bg-gray-100">
            <FiEdit2 /> Edit
          </li>
          <li className="flex cursor-pointer items-center gap-2 p-2 text-red-500 hover:bg-gray-100">
            <FaRegTrashCan /> Delete
          </li>
        </ul>
      )}
    </div>
  );
}
