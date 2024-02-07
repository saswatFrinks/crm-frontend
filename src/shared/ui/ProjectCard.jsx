import React from 'react';
import { CiFileOn } from 'react-icons/ci';
import { FiFilePlus } from 'react-icons/fi';
import Button from './Button';

function Card() {
  return (
    <div className="group basis-80 rounded-md border border-gray-300/90 bg-white p-6 shadow-sm">
      <div className="mb-6 inline-flex rounded-md bg-[#E7E7FF]/50 p-2">
        <CiFileOn size={28} />
      </div>

      <h3 className="text-lg font-semibold mb-2">Project Name</h3>

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

function Create() {
  return (
    <div className="flex basis-80 cursor-pointer items-center justify-center rounded-md border border-f-primary/25 bg-[#E7E7FF]/25 p-6 shadow-sm  duration-100 hover:bg-[#C6C4FF]">
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
