import Box from '@/shared/icons/Box';
import Pan from '@/shared/icons/Pan';
import ZoomIn from '@/shared/icons/ZoomIn';
import ZoomOut from '@/shared/icons/ZoomOut';
import Button from '@/shared/ui/Button';
import React from 'react';

export default function Assembly() {
  const actions = [
    {
      title: 'zoom in',
      icon: ZoomIn,
    },
    {
      title: 'zoom out',
      icon: ZoomOut,
    },
    {
      title: 'pan',
      icon: Pan,
    },
    {
      title: 'box',
      icon: Box,
    },
  ];

  return (
    <div className="grid h-screen grid-cols-12 ">
      <div className="col-span-5 grid grid-rows-12 border-r-[1px] border-gray-400">
        <div className="row-span-11">1</div>
        <div className=" flex justify-center border-t-[1px] border-gray-400">
          <div className="flex max-w-md flex-1 items-center justify-center gap-4">
            <Button size="xs" color="border">
              Cancel
            </Button>
            <Button size="xs" color="flat">
              Save and Close
            </Button>
            <Button size="xs">Finish</Button>
          </div>
        </div>
      </div>

      <div className="col-span-7 grid grid-rows-12">
        <div className="row-span-11">3</div>
        <div className="flex items-center justify-between border-t-[1px] border-gray-400">
          <ul className="flex items-center gap-6 px-4">
            {actions.map((t) => (
              <li
                key={t.title}
                className="flex cursor-pointer flex-col items-center p-2"
              >
                <t.icon />
                {t.title}
              </li>
            ))}
          </ul>
          <div className="flex w-[300px] gap-4">
            <Button color="flat" size="xs">
              Cancel
            </Button>
            <Button size="xs">Confirm</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
