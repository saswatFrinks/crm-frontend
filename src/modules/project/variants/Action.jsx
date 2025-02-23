import React from 'react';
import { HiDotsVertical } from 'react-icons/hi';
import { FaRegTrashCan } from 'react-icons/fa6';
import { FiEdit2 } from 'react-icons/fi';
import useClickOutSide from '@/shared/hooks/useClickOutside';
import { tv } from 'tailwind-variants';

export default function Action(props) {
  const {
    handleOpenModal,
    id,
    hasReset=false,
    setId,
    deleteImageById = null,
  } = props;
  const [open, setOpen] = React.useState(false);

  const ref = React.useRef(null);

  useClickOutSide(ref, () => setOpen(false));

  const ul = tv({
    base: 'absolute right-4 w-full top-0 rounded-md bg-white shadow-xl border',
    variants: {
      hasReset: {
        true: 'w-32',
        false: 'w-24',
      },
    },
  });

  return (
    <div className="relative flex justify-end z-10" onClick={(event) => {event.preventDefault();event.stopPropagation();}}>
      <HiDotsVertical
        size={18}
        className="cursor-pointer"
        onClick={(event) => {event.preventDefault();event.stopPropagation();setOpen(true)}}
      />
      {open && (
        <ul className={ul({ hasReset })} ref={ref}>
          <li className="flex cursor-pointer items-center gap-2 p-2 text-xs hover:bg-gray-100">
            <FiEdit2 /> Edit
          </li>
          <li
            className="flex cursor-pointer items-center gap-2 p-2 text-xs text-red-500 hover:bg-gray-100"
            onClick={() => {
              if(setId){
                setId(id);
              }
              handleOpenModal && handleOpenModal('delete');

              if (deleteImageById) {
                deleteImageById(id);
              }

              setOpen(false);
            }}
          >
            <FaRegTrashCan /> Delete
          </li>
        </ul>
      )}
    </div>
  );
}
