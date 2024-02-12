import React from 'react';
import { CiFileOn } from 'react-icons/ci';
import { FiFilePlus } from 'react-icons/fi';
import Button from './Button';
import { HiDotsVertical } from 'react-icons/hi';
import { FaRegCopy } from 'react-icons/fa';
import { FaRegTrashCan } from 'react-icons/fa6';
import { FiEdit2 } from 'react-icons/fi';
import useClickOutSide from '../hooks/useClickOutside';
import { useSetRecoilState } from 'recoil';
import { modalAtom } from '../states/modal.state';

function Card() {
  const setOpenModal = useSetRecoilState(modalAtom);

  const [open, setOpen] = React.useState(false);

  const ref = React.useRef(null);

  useClickOutSide(ref, () => setOpen(false));

  return (
    <div className="group relative basis-80 rounded-md border border-gray-300/90 bg-white p-6 shadow-sm">
      <div
        className="absolute right-4 top-4 hidden cursor-pointer group-hover:block"
        onClick={() => setOpen(true)}
      >
        <svg
          className="h-4 w-4"
          viewBox="0 0 4 22"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M2.5 10.9167C2.5 10.5025 2.16421 10.1667 1.75 10.1667C1.33579 10.1667 1 10.5025 1 10.9167C1 11.3309 1.33579 11.6667 1.75 11.6667C2.16421 11.6667 2.5 11.3309 2.5 10.9167Z"
            fill="#0E0F0F"
          />
          <path
            d="M2.5 1.58333C2.5 1.16912 2.16421 0.833332 1.75 0.833332C1.33579 0.833332 1 1.16912 1 1.58333C1 1.99755 1.33579 2.33333 1.75 2.33333C2.16421 2.33333 2.5 1.99755 2.5 1.58333Z"
            fill="#0E0F0F"
          />
          <path
            d="M2.5 20.25C2.5 19.8358 2.16421 19.5 1.75 19.5C1.33579 19.5 1 19.8358 1 20.25C1 20.6642 1.33579 21 1.75 21C2.16421 21 2.5 20.6642 2.5 20.25Z"
            fill="#0E0F0F"
          />
          <path
            d="M2.5 10.9167C2.5 10.5025 2.16421 10.1667 1.75 10.1667C1.33579 10.1667 1 10.5025 1 10.9167C1 11.3309 1.33579 11.6667 1.75 11.6667C2.16421 11.6667 2.5 11.3309 2.5 10.9167Z"
            stroke="#0E0F0F"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M2.5 1.58333C2.5 1.16912 2.16421 0.833332 1.75 0.833332C1.33579 0.833332 1 1.16912 1 1.58333C1 1.99755 1.33579 2.33333 1.75 2.33333C2.16421 2.33333 2.5 1.99755 2.5 1.58333Z"
            stroke="#0E0F0F"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M2.5 20.25C2.5 19.8358 2.16421 19.5 1.75 19.5C1.33579 19.5 1 19.8358 1 20.25C1 20.6642 1.33579 21 1.75 21C2.16421 21 2.5 20.6642 2.5 20.25Z"
            stroke="#0E0F0F"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      {open && (
        <ul
          className="bg-whie absolute right-8 top-3 w-28 rounded-md shadow-2xl border"
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
        <CiFileOn className="duration-100 h-8 w-8 text-f-primary group-hover:h-6 group-hover:w-6" />
      </div>

      <h3 className="mb-2 text-lg font-semibold">Project Name</h3>

      <p className="line-clamp-2 min-h-8 text-[#464A4D] duration-100 group-hover:hidden">
        Project descciption in one line or two
      </p>
      <div className=" hidden h-8 items-center justify-center gap-4 duration-100 group-hover:flex">
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
      <p className="flex items-center gap-4 font-semibold text-f-primary">
        <svg
          width="24"
          height="30"
          viewBox="0 0 24 30"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M14.6666 1.66663H3.99992C3.29267 1.66663 2.6144 1.94758 2.1143 2.44767C1.6142 2.94777 1.33325 3.62605 1.33325 4.33329V25.6666C1.33325 26.3739 1.6142 27.0521 2.1143 27.5522C2.6144 28.0523 3.29267 28.3333 3.99992 28.3333H19.9999C20.7072 28.3333 21.3854 28.0523 21.8855 27.5522C22.3856 27.0521 22.6666 26.3739 22.6666 25.6666V9.66663M14.6666 1.66663L22.6666 9.66663M14.6666 1.66663V9.66663H22.6666M11.9999 23V15M7.99992 19H15.9999"
            stroke="#5538EE"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        Start a new project
      </p>
    </div>
  );
}

export default {
  Card,
  Create,
};
