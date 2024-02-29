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
  editingRectAtom,
  imageStatusAtom,
  selectedFileAtom,
  selectedRoiSelector,
  stageAtom,
  stepAtom,
} from './state';
import { IMAGE_STATUS, STATUS } from '@/core/constants';
import Steps from './components/Steps';
import UploadImageStep from './upload-image-step';
import InspectionParameterStep from './inspection-parameter-step';
import LabelImage from './label-image-step';
import PreTrainingStep from './pre-training-step';
import ImageList from './label-image-step/ImageList';
import ProjectCreateLoader from '@/shared/ui/ProjectCreateLoader';

export default function Assembly() {
  const setStage = useSetRecoilState(stageAtom);

  const [isEditing, setIsEditing] = useRecoilState(editingAtom);

  const [imageStatus, setImageStatus] = useRecoilState(imageStatusAtom);

  const [configuration, setConfiguration] = useRecoilState(assemblyAtom);

  const currentRoiId = useRecoilValue(currentRoiIdAtom);

  const [isEditingRect, setEditingRect] = useRecoilState(editingRectAtom);

  const [step, setStep] = useRecoilState(stepAtom);

  const handleNext = () => {
    setStep((t) => {
      if (t == 3) return t;
      return t + 1;
    });
  };

  const handlePrev = () => {
    setStep((t) => {
      if (t == 0) return t;
      return t - 1;
    });
  };

  const calcHeight = () => {
    return (window.innerHeight * 11) / 12 - 154;
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
    if (!isEditing) return;

    setImageStatus((t) => ({
      ...IMAGE_STATUS,
      draw: !t.draw,
      drawing: !t.drawing,
    }));
  };

  const cancel = () => {
    setEditingRect(false);
    setIsEditing(false);
  };

  const submmit = () => {
    setEditingRect(false);
    setIsEditing(false);
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
      canAction: true,
    },
    {
      title: 'zoom out',
      icon: ZoomOut,
      action: handleZoomOut,
      active: false,
      canAction: true,
    },
    {
      title: 'pan',
      icon: Pan,
      action: handlePan,
      active: imageStatus.drag,
      canAction: true,
    },
    {
      title: 'box',
      icon: Box,
      action: handleDrawBox,
      active: imageStatus.draw,
      canAction: isEditing,
    },
  ];

  const stepObj = {
    0: <UploadImageStep />,
    1: <InspectionParameterStep />,
    2: <LabelImage />,
    3: <PreTrainingStep />,
  };

  return (
    <>
      <div className="grid h-screen grid-cols-12 ">
        <div className="col-span-5 grid grid-rows-12 border-r-[1px] border-gray-400">
          <div className="row-span-11 bg-white">
            <h1 className="mb-4 px-6 pt-6 text-3xl font-bold">
              Assembly Configuration
            </h1>

            <Steps />

            <div
              className="overflow-y-auto p-6"
              style={{
                height: calcHeight(),
              }}
            >
              {stepObj[step]}
            </div>
          </div>

          <div className=" flex justify-center border-t-[1px] border-gray-400 bg-white">
            <div className="flex max-w-md flex-1 items-center justify-center gap-4">
              <Button size="xs" variant="border">
                Cancel
              </Button>
              <Button size="xs" variant="flat" onClick={handlePrev}>
                Back
              </Button>
              <Button size="xs" onClick={handleNext}>
                Next
              </Button>
            </div>
          </div>
        </div>

        <div className="col-span-7 grid grid-rows-12">
          <div className="row-span-11 flex flex-col items-center justify-center gap-4 bg-[#EAEDF1]">
            <UploadImage />
          </div>

          <div className="flex items-center justify-between border-t-[1px] border-gray-400 bg-white">
            <ul className="flex items-center gap-6 px-4">
              {actions.map((t) => (
                <li
                  key={t.title}
                  className={`flex cursor-pointer select-none flex-col items-center p-2 ${t.active ? 'text-f-primary' : ''} ${t.canAction ? '' : 'cursor-not-allowed opacity-30'}`}
                  onClick={t?.action}
                >
                  <t.icon active={t.active} />
                  {t.title}
                </li>
              ))}
            </ul>
            {isEditing && (
              <div className="flex w-[300px] gap-4 px-4">
                <Button
                  color="secondary"
                  variant="flat"
                  size="xs"
                  onClick={cancel}
                >
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
      {false && (
        <ProjectCreateLoader title="Please wait while we analyse the project..." />
      )}
    </>
  );
}
