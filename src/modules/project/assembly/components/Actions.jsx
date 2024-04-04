import Box from '@/shared/icons/Box';
import Pan from '@/shared/icons/Pan';
import ZoomIn from '@/shared/icons/ZoomIn';
import ZoomOut from '@/shared/icons/ZoomOut';
import Button from '@/shared/ui/Button';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';

import { IMAGE_STATUS, STATUS } from '@/core/constants';
import { currentRoiIdAtom, editingAtom, imageStatusAtom, rectanglesAtom, selectedRoiSelector, stageAtom } from '../../state';
// import { editingRectAtom } from '../state';

export default function Actions({ cancel, submit }) {
  const setStage = useSetRecoilState(stageAtom);

  const [imageStatus, setImageStatus] = useRecoilState(imageStatusAtom);

  const [isEditing, setIsEditing] = useRecoilState(editingAtom);
  const currentRoiId = useRecoilValue(currentRoiIdAtom);
  const rectangles = useRecoilValue(rectanglesAtom)

  //   const [isEditingRect, setEditingRect] = useRecoilState(editingRectAtom);

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
    let ret = false
    console.log(rectangles, currentRoiId)
    rectangles.forEach((rect)=>{
      if(rect.roiId === currentRoiId){
        ret = true
      }
    })
    if(ret) return;
    setImageStatus((t) => ({
      ...IMAGE_STATUS,
      draw: !t.draw,
      drawing: !t.drawing,
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

  return (
    <>
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
          <Button color="secondary" variant="flat" size="xs" onClick={cancel}>
            Cancel
          </Button>
          <Button size="xs" onClick={submit}>
            Confirm
          </Button>
        </div>
      )}
    </>
  );
}
