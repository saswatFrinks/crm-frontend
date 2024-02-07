import { IoIosArrowDown } from 'react-icons/io';
export default function UserDropdown() {
  return (
    <div className="flex w-full cursor-pointer items-center justify-between gap-4 px-2">
      <div className="flex h-10 w-10 items-center justify-center rounded-md bg-gray-200 font-semibold">
        A
      </div>
      <div className=" grow-[1]">Aditya</div>
      <IoIosArrowDown />
    </div>
  );
}
