import React from 'react';
import { CiFileOn } from 'react-icons/ci';
import Button from '../../../shared/ui/Button';
import { FaRegCopy } from 'react-icons/fa';
import { FaRegTrashCan } from 'react-icons/fa6';
import { FiEdit2 } from 'react-icons/fi';
import useClickOutSide from '../../../shared/hooks/useClickOutside';
import { useSetRecoilState } from 'recoil';
import { modalAtom } from '../../../shared/states/modal.state';
import { Link } from 'react-router-dom';
import PlusFile from '../../../shared/icons/PlusFile';
import ThreeDots from '../../../shared/icons/File';

function Card({ project, setProjectForDelete }) {
  const setOpenModal = useSetRecoilState(modalAtom);

  const [open, setOpen] = React.useState(false);

  const ref = React.useRef(null);

  useClickOutSide(ref, () => setOpen(false));

  return (
    <div className="group relative basis-80 rounded-md border border-gray-300/90 bg-white px-10 py-8 shadow-sm">
      <div
        className="absolute right-8 top-8 hidden cursor-pointer group-hover:block"
        onClick={() => setOpen(true)}
      >
        <ThreeDots />
      </div>

      {open && (
        <>
          <div className="absolute right-12 top-8 z-[100] border-y-8 border-l-8 border-r-0 border-solid border-y-transparent border-l-white"></div>

          <ul
            className="absolute right-14 top-6 z-50 w-24 rounded-md bg-white drop-shadow-2xl "
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
              onClick={() => {
                setProjectForDelete(project);
                setOpenModal(true);
                setOpen(false);
              }}
            >
              <FaRegTrashCan size={16} />
              Delete
            </li>
          </ul>
        </>
      )}

      <div className="mb-6 inline-flex rounded-md bg-[#E7E7FF]/50 p-2">
        <CiFileOn className="h-8 w-8 text-f-primary duration-100 group-hover:h-6 group-hover:w-6" />
      </div>

      <h3 className="mb-2 text-lg font-semibold">{project.name}</h3>

      <p className="line-clamp-2 min-h-8 text-[#464A4D] duration-100 group-hover:hidden">
        Project descciption in one line or two
      </p>
      <div className=" hidden h-8 items-center justify-center gap-4 duration-100 group-hover:flex">
        <Button size="xs" color="flat">
          Edit
        </Button>
        <Button size="xs">
          <Link to={`/project/${project.id}`} className="block h-full w-full">
            Build
          </Link>
        </Button>
      </div>
    </div>
  );
}

function Create(props) {
  const { onClick } = props;

  return (
    <div
      className="flex basis-80 cursor-pointer items-center justify-center rounded-md border border-f-primary/25 bg-[#E7E7FF]/25 px-10 py-8 shadow-sm  duration-100 hover:bg-[#C6C4FF]"
      onClick={onClick}
    >
      <p className="flex items-center gap-4 font-semibold text-f-primary">
        <PlusFile />
        Start a new project
      </p>
    </div>
  );
}

export default {
  Card,
  Create,
};
