import Box from '@/shared/icons/Box';
import Pan from '@/shared/icons/Pan';
import ZoomIn from '@/shared/icons/ZoomIn';
import ZoomOut from '@/shared/icons/ZoomOut';
import Button from '@/shared/ui/Button';

import Configuration from './components/Configuration';
import UploadImage from './components/UploadImage';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import {
  assemblyAtom,
  currentRoiIdAtom,
  editingAtom,
  imageStatusAtom,
  stageAtom,
} from './states';
import { IMAGE_STATUS, STATUS } from '@/core/constants';

export default function Assembly() {
  const setStage = useSetRecoilState(stageAtom);

  const [isEditing, setIsEditing] = useRecoilState(editingAtom);

  const [imageStatus, setImageStatus] = useRecoilState(imageStatusAtom);

  const [configuration, setConfiguration] = useRecoilState(assemblyAtom);

  const currentRoiId = useRecoilValue(currentRoiIdAtom);

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

  const handlePan = () => {
    setImageStatus((t) => ({
      ...IMAGE_STATUS,
      drag: !t.drag,
    }));
  };

  const handleDrawBox = () => {
    setImageStatus((t) => ({
      ...IMAGE_STATUS,
      draw: !t.draw,
    }));
  };

  const submmit = () => {
    setIsEditing(false)
    setConfiguration((t) => ({
      ...t,
      rois: t.rois.map((k) => ({
        ...k,
        status: k.id == currentRoiId ? STATUS.FINISH : k.status,
      })),
    }));
  };

  const actions = [
    {
      title: 'zoom in',
      icon: ZoomIn,
      action: handleZoomIn,
      active: false,
    },
    {
      title: 'zoom out',
      icon: ZoomOut,
      action: handleZoomOut,
      active: false,
    },
    {
      title: 'pan',
      icon: Pan,
      action: handlePan,
      active: imageStatus.drag,
    },
    {
      title: 'box',
      icon: Box,
      action: handleDrawBox,
      active: imageStatus.draw,
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
                  className={`flex cursor-pointer select-none flex-col items-center p-2 ${t.active ? 'text-f-primary' : ''}`}
                  onClick={t?.action}
                >
                  <t.icon active={t.active} />
                  {t.title}
                </li>
              ))}
            </ul>
            {isEditing && (
              <div className="flex w-[300px] gap-4 px-4">
                <Button color="secondary" variant="flat" size="xs">
                  Cancel
                </Button>
                <Button size="xs" onClick={submmit}>
                  Confirm
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
