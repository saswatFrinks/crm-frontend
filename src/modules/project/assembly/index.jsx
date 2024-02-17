import BigImage from '@/shared/icons/BigImage';
import Box from '@/shared/icons/Box';
import Pan from '@/shared/icons/Pan';
import Upload from '@/shared/icons/Upload';
import ZoomIn from '@/shared/icons/ZoomIn';
import ZoomOut from '@/shared/icons/ZoomOut';
import Button from '@/shared/ui/Button';

import Configuration from './components/Configuration';
import UploadImage from './components/UploadImage';
import { useSetRecoilState } from 'recoil';
import { stageAtom } from './states';

export default function Assembly() {
  const setStage = useSetRecoilState(stageAtom);

  const calcHeight = () => {
    return (window.innerHeight * 11) / 12 - 84;
  };

  const handleZoomIn = () => {
    setStage((prevValue) => {
      let scale = Math.min(10.0, Math.ceil(prevValue.scale * 1.1 * 10) / 10);
      if (scale > 10) scale = 10;

      return {
        ...prevValue,
        scale,
      };
    });
  };

  const handleZoomOut = () => {
    setStage((prevValue) => {
      let scale = Math.max(0.1, Math.floor(prevValue.scale * 0.9 * 10) / 10);
      if (scale < 1) scale = 1;

      return {
        ...prevValue,
        scale,
      };
    });
  };

  const actions = [
    {
      title: 'zoom in',
      icon: ZoomIn,
      action: handleZoomIn,
    },
    {
      title: 'zoom out',
      icon: ZoomOut,
      action: handleZoomOut,
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
            <UploadImage />
          </div>
          <div className="flex items-center justify-between border-t-[1px] border-gray-400">
            <ul className="flex items-center gap-6 px-4">
              {actions.map((t) => (
                <li
                  key={t.title}
                  className="flex cursor-pointer flex-col items-center p-2 select-none"
                  onClick={t?.action}
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
