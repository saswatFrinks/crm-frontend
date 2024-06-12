import Box from '@/shared/icons/Box';
import Poly from '@/shared/icons/Poly';
import Pan from '@/shared/icons/Pan';
import ZoomIn from '@/shared/icons/ZoomIn';
import ZoomOut from '@/shared/icons/ZoomOut';
import FitToCenter from '@/shared/icons/FitToCenter';
import OneIsToOne from '@/shared/icons/OneIsToOne';
import Button from '@/shared/ui/Button';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';

import {
  ACTION_NAMES,
  IMAGE_STATUS,
  RECTANGLE_TYPE,
  STATUS,
} from '@/core/constants';
import {
  assemblyAtom,
  currentRectangleIdAtom,
  currentRoiIdAtom,
  editingAtom,
  imageStatusAtom,
  lastActionNameAtom,
  rectanglesAtom,
  polygonsAtom,
  rectanglesTypeAtom,
  selectedRoiSelector,
  stageAtom,
  polygonsTypeAtom,
} from '../../state';
import { useState } from 'react';
import { prevStatusAtom } from '../state';
// import { editingRectAtom } from '../state';

export default function Actions({ cancel, submit }) {
  const setStage = useSetRecoilState(stageAtom);

  const [imageStatus, setImageStatus] = useRecoilState(imageStatusAtom);

  const [isHovered, setIsHovered] = useState('');

  const isEditing = useRecoilValue(editingAtom);
  const currentRoiId = useRecoilValue(currentRoiIdAtom);
  const rectangles = useRecoilValue(rectanglesAtom);
  const polygons = useRecoilValue(polygonsAtom);
  const configuration = useRecoilValue(assemblyAtom);
  const prevStatus = useRecoilValue(prevStatusAtom);

  const roiIndex = configuration.rois.findIndex(
    (ele) => ele.id == currentRoiId
  );
  const currentRectType = useRecoilValue(rectanglesTypeAtom);
  const currentPolyType = useRecoilValue(polygonsTypeAtom);

  const selectedRectId = useRecoilValue(currentRectangleIdAtom);
  const [actionName, setActionName] = useRecoilState(lastActionNameAtom);

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
    console.log("drawModebox",imageStatus.drawMode)
    if (!isEditing || imageStatus.drawMode === true || prevStatus === 'finish') return;
    let ret = false;
    console.log('handleDrawBox', { rectangles, currentRoiId });
    rectangles.forEach((rect) => {
      if (rect.roiId && rect.roiId === currentRoiId) {
        ret = true;
      }
    });
    if (ret) return;
    console.log('click rectangular selection', { IMAGE_STATUS });
    setImageStatus((t) => ({
      ...IMAGE_STATUS,
      draw: !t.draw,
      drawing: !t.drawing,
      drawMode: 'RECT',
    }));
    setActionName(ACTION_NAMES.SELECTED);
  };

  const handleDrawPolygon = () => {
    console.log("drawModepoly",imageStatus.drawMode)
    if (!isEditing || imageStatus.drawMode === true || prevStatus === 'finish') return;
    let ret = false;
    console.log('handleDrawBox', { polygons, currentRoiId });
    polygons.forEach((poly) => {
      if (poly.roiId && poly.roiId === currentRoiId) {
        ret = true;
      }
    });
    if (ret) return;
    console.log('click polygon selection', { IMAGE_STATUS });
    setImageStatus((t) => ({
      ...IMAGE_STATUS,
      draw: !t.draw,
      drawing: !t.drawing,
      drawMode: 'POLY',
    }));
    setActionName(ACTION_NAMES.SELECTED);
  };

  const handleOneToOne = () => {
    setImageStatus((p) => ({ ...p, oneToOne: true }));
  };

  const handleFitToCenter = () => {
    setImageStatus((p) => ({ ...p, fitToCenter: true }));
  };

  console.log("drawMode1",imageStatus.drawMode)

  const actions = [
    // {
    //   title: 'zoom in',
    //   icon: ZoomIn,
    //   action: handleZoomIn,
    //   active: false,
    //   canAction: true,
    // },
    // {
    //   title: 'zoom out',
    //   icon: ZoomOut,
    //   action: handleZoomOut,
    //   active: false,
    //   canAction: true,
    // },
    // {
    //   title: 'pan',
    //   icon: Pan,
    //   action: handlePan,
    //   active: imageStatus.drag,
    //   canAction: true,
    // },
    {
      title: 'Fit to frame',
      icon: FitToCenter,
      action: handleFitToCenter,
      active: false,
      canAction: true,
    },
    {
      title: 'Default Zoom',
      icon: OneIsToOne,
      action: handleOneToOne,
      active: false,
      canAction: true,
    },
    {
      title: 'Rectangular Selection',
      icon: Box,
      action: handleDrawBox,
      active: imageStatus.draw && prevStatus === 'default',
      canAction:
        isEditing &&
        ((currentRectType == RECTANGLE_TYPE.ROI &&
          roiIndex >= 0 &&
          !rectangles.some(
            (rec) => rec.roiId == configuration.rois[roiIndex].id
          )) ||
          (RECTANGLE_TYPE.ANNOTATION_LABEL === currentRectType &&
            ACTION_NAMES.SELECTED !== actionName)),
    },
    {
      title: 'Polygon Selection',
      icon: Poly,
      action: handleDrawPolygon,
      active: imageStatus.draw && prevStatus === 'default',
      canAction:
        isEditing && 
        ((currentPolyType == RECTANGLE_TYPE.ROI &&
          roiIndex >= 0 &&
          !polygons.some(
            (poly) => poly.roiId == configuration.rois[roiIndex].id
          )) ||
          (RECTANGLE_TYPE.ANNOTATION_LABEL === currentPolyType &&
            ACTION_NAMES.SELECTED !== actionName)),
    },
  ];

  console.log('Actions', { isEditing }, {imageStatus}, {prevStatus});

  return (
    <>
      <ul className="flex items-center gap-6 px-4">
        {actions.map((t) => (
          <div key={t.title} className="relative">
            <li
              className={`flex cursor-pointer select-none flex-col items-center p-2 ${t.active ? 'text-f-primary' : ''} ${t.canAction ? '' : 'cursor-not-allowed opacity-30'}`}
              onClick={t?.action}
              onMouseEnter={() => setIsHovered(t.title)}
              onMouseLeave={() => setIsHovered('')}
            >
              <t.icon active={t.active} />
              {/* {t.title} */}
            </li>
            {isHovered === t.title && (
              <div className="absolute bottom-12 left-1/2 z-10 w-auto -translate-x-1/2 transform rounded-md bg-f-primary px-4 py-2 text-sm text-white">
                {t.title}
              </div>
            )}
          </div>
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
