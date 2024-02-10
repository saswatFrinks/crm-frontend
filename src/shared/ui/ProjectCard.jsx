import React from 'react';
import { CiFileOn } from 'react-icons/ci';
import { FiFilePlus } from 'react-icons/fi';
import Button from './Button';
import { HiDotsVertical } from 'react-icons/hi';
import { FaRegCopy } from 'react-icons/fa';
import { FaRegEdit } from 'react-icons/fa';
import { FaRegTrashCan } from 'react-icons/fa6';
import useClickOutSide from '../hooks/useClickOutside';
import { FiEdit2 } from 'react-icons/fi';
import { useSetRecoilState } from 'recoil';
import { modalAtom } from '../states/modal.state';

function Card() {
  const setOpenModal = useSetRecoilState(modalAtom);

  const [open, setOpen] = React.useState(false);

  const ref = React.useRef(null);

  useClickOutSide(ref, () => setOpen(false));

  return (
    <div className="group relative basis-80 rounded-md border border-gray-300/90 bg-white p-6 shadow-sm">
      <div className="absolute right-2 top-2 hidden group-hover:block">
        <HiDotsVertical
          size={20}
          className="cursor-pointer"
          onClick={() => setOpen(true)}
        />
      </div>
      {open && (
        <ul
          className="bg-whie absolute right-8 top-3 w-28 rounded-md shadow-2xl"
          ref={ref}
        >
          <li className="flex cursor-pointer gap-2 p-2 text-xs duration-100 hover:bg-gray-50">
            <FaRegCopy size={16} /> Clone
          </li>
          <li className="flex cursor-pointer gap-2 p-2 text-xs duration-100 hover:bg-gray-50">
            <FiEdit2 size={16} /> Edit
          </li>
          <li
            className="flex cursor-pointer gap-2 p-2 text-xs text-red-500 duration-100 hover:bg-gray-50"
            onClick={() => setOpenModal(true)}
          >
            <FaRegTrashCan size={16} />
            Delete
          </li>
        </ul>
      )}

      <div className="mb-6 inline-flex rounded-md bg-[#E7E7FF]/50 p-2">
        <CiFileOn size={28} />
      </div>

      <h3 className="mb-2 text-lg font-semibold">Project Name</h3>

      <p className="line-clamp-2 min-h-8 text-[#464A4D] group-hover:hidden">
        Project descciption in one line or two
      </p>
      <div className=" hidden h-8 items-center justify-center gap-4 group-hover:flex">
        <Button size="xs" color="flat">
          Edit
        </Button>
        <Button size="xs">Build</Button>
      </div>
    </div>
  );
}

function Create(props) {
  const { onClick } = props;

  return (
    <div
      className="flex basis-80 cursor-pointer items-center justify-center rounded-md border border-f-primary/25 bg-[#E7E7FF]/25 p-6 shadow-sm  duration-100 hover:bg-[#C6C4FF]"
      onClick={onClick}
    >
      <p className="flex items-center gap-2 font-semibold text-f-primary">
        <FiFilePlus size={28} />
        Start a new project
      </p>
    </div>
  );
}

export default {
  Card,
  Create,
};
