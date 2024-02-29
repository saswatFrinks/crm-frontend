import storageService from '@/core/storage';
import { IoIosArrowDown } from 'react-icons/io';
export default function UserDropdown() {
  // const { name } = JSON.parse(storageService.get('user'));

  return (
    <div className="flex w-full cursor-pointer items-center justify-between gap-4 px-2">
      <div className="flex h-10 w-10 items-center justify-center rounded-md bg-gray-200 font-semibold">
        {/* {name[0].toUpperCase()} */}
      </div>
      {/* <div className=" grow">{name}</div> */}
      <IoIosArrowDown />
    </div>
  );
}
