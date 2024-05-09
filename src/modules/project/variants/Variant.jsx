import PlusFile from '@/shared/icons/PlusFile';
import { CiFileOn } from 'react-icons/ci';
import { Link } from 'react-router-dom';
import Action from '@/modules/team-user/Action';

function Card({ title = 'Variant name', to, state, id, deleteFn, handleOpenModal }) {
  return (
    <Link
      to={to}
      state={state}
      className=" flex basis-80 items-center justify-between rounded-md border border-gray-300/90 bg-white px-10 py-4 shadow-sm"
    >
      <div className="inline-flex rounded-md bg-[#E7E7FF]/50 p-2">
        <CiFileOn className="h-6 w-6 text-f-primary duration-100 group-hover:h-6 group-hover:w-6" />
      </div>
      {title}
      <div onClick={event=>{event.preventDefault();event.stopPropagation()}}>
        <Action id={id}
        deleteImageById={deleteFn}
        />
      {/* <ThreeDots /> */}
      </div>
    </Link>
  );
}

function Create(props) {
  const { onClick, title = 'Add New Variant' } = props;

  return (
    <div
      className="flex basis-80 cursor-pointer items-center justify-center rounded-md border border-f-primary/25 bg-[#E7E7FF]/25 px-6 py-6 shadow-sm  duration-100 hover:bg-[#C6C4FF]"
      onClick={onClick}
    >
      <p className="flex items-center gap-4 font-semibold text-f-primary">
        <PlusFile />
        {title}
      </p>
    </div>
  );
}

export default {
  Card,
  Create,
};