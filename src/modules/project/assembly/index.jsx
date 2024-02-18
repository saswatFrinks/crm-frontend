import BigImage from '@/shared/icons/BigImage';
import Box from '@/shared/icons/Box';
import Pan from '@/shared/icons/Pan';
import Upload from '@/shared/icons/Upload';
import ZoomIn from '@/shared/icons/ZoomIn';
import ZoomOut from '@/shared/icons/ZoomOut';
import Button from '@/shared/ui/Button';

import Configuration from './Configuration';

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

  const calcHeight = () => {
    return (window.innerHeight * 11) / 12 - 84;
  };

  return (
    <>
      <div className="grid h-screen grid-cols-12 ">
        <div className="col-span-5 grid grid-rows-12 border-r-[1px] border-gray-400">
          <div className="row-span-11 ">
            <h1 className="mb-2 px-6 pt-6 text-3xl font-bold">
              Assembly Configuration
            </h1>

            <div
              className="overflow-y-auto p-6"
              style={{
                height: calcHeight(),
              }}
            >
              <Configuration />
            </div>
          </div>

          <div className=" flex justify-center border-t-[1px] border-gray-400">
            <div className="flex max-w-md flex-1 items-center justify-center gap-4">
              <Button size="xs" variant="border">
                Cancel
              </Button>
              <Button size="xs" variant="flat">
                Save and Close
              </Button>
              <Button size="xs">Finish</Button>
            </div>
          </div>
        </div>

        <div className="col-span-7 grid grid-rows-12">
          <div className="row-span-11 flex flex-col items-center justify-center gap-4 bg-[#EAEDF1]">
            <BigImage />
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-f-primary px-20 py-2 text-white duration-100 hover:bg-f-secondary">
              <Upload /> Upload master image
              <input type="file" hidden />
            </label>
          </div>
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
            <div className="flex w-[300px] gap-4 px-4">
              <Button color="variant" size="xs">
                Cancel
              </Button>
              <Button size="xs">Confirm</Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
