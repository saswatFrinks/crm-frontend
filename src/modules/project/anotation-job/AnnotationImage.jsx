import BigImage from '@/shared/icons/BigImage';
import React from 'react';
import { Upload } from 'react-feather';

import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { Image, Layer, Stage } from 'react-konva';
import Crosshair from '../assembly/components/Crosshair';
import { useContainerSize } from '@/shared/hooks/useContainerSize';
import useImage from 'use-image';
import { useMouseWheel } from '../assembly/hooks/useMouseWheel';
import {
  currentRectangleIdAtom,
  dragAtom,
  imageStatusAtom,
  mousePositionAtom,
  rectanglesAtom,
  selectedFileAtom,
  stageAtom,
} from '../state';
import { editingRectAtom } from '../assembly/state';
import useDrawRectangle from '../assembly/hooks/useDrawRectangle';
import { RECTANGLE_TYPE } from '@/core/constants';
import Rectangle from '../assembly/components/Rectangle';

export default function AnnotationImage() {
  const [imageStatus, setImageStatus] = useRecoilState(imageStatusAtom);
  const mousePosition = useRecoilValue(mousePositionAtom);
  const selectedFile = useRecoilValue(selectedFileAtom);

  const [rectangles, setRectangles] = useRecoilState(rectanglesAtom);
  const stage = useRecoilValue(stageAtom);

  const { wheel } = useMouseWheel({});

  const drawRectHook = useDrawRectangle(RECTANGLE_TYPE.ANNOTATION_LABEL);

  const containerRef = React.useRef();

  const [file, setFile] = React.useState(null);

  const [image] = useImage(file);

  const [isEditingRect, setEditingRect] = useRecoilState(editingRectAtom);

  const [selectedRectId, setSelectedRectId] = useRecoilState(
    currentRectangleIdAtom
  );

  const setStage = useSetRecoilState(stageAtom);

  const [dragPosition, setDragPosition] = useRecoilState(dragAtom);

  const { size, scaleFactor } = useContainerSize({
    containerRef,
    image,
  });

  const handleMouseUp = (e) => {
    console.log('up');

    setSelectedRectId(null);

    setEditingRect(false);

    setImageStatus((t) => ({
      ...t,
      dragging: false,
      drawing: false,
      draw: false,
    }));
  };

  const handleMouseDown = (e) => {
    console.log('down');

    if (!imageStatus.dragging && imageStatus.drag) {
      setImageStatus((t) => ({ ...t, dragging: true }));
      setDragPosition({ x: e.evt.clientX, y: e.evt.clientY });
    }

    drawRectHook.create(e, false, selectedFile?.id);
  };

  const handleMouseMove = (e) => {
    if (imageStatus.dragging && imageStatus.drag) {
      const dx = e.evt.clientX - dragPosition.x;
      const dy = e.evt.clientY - dragPosition.y;

      setStage((stage) => ({ ...stage, x: stage.x + dx, y: stage.y + dy }));
      setDragPosition({ x: e.evt.clientX, y: e.evt.clientY });
    }

    drawRectHook.draw(e, selectedFile?.id);
  };

  const handleClickRectangle = (e, id) => {
    console.log(e.target, id);
    if (id == e.target.attrs.id) {
      setEditingRect(true);
      setSelectedRectId(id);
    }
    // if (labelType === e.target.attrs.type) {
    //   setIsEditRect(true);
    //   setSelectRectangleId(id);
    //   setHoveredId(id);
    // }
  };

  React.useEffect(() => {
    if (selectedFile?.url) {
      setFile(selectedFile?.url);
    }
  }, [selectedFile?.id, selectedFile]);

  return (
    <div
      className="relative flex h-full w-full flex-col items-center justify-center gap-4"
      ref={containerRef}
      style={{
        width: ((window.innerWidth - 16 * 4) * 9) / 12,
      }}
    >
      <div
        className={`grow overflow-auto ${imageStatus.dragging ? 'cursor-crosshair' : ''}`}
      >
        <Stage
          width={size.width}
          height={size.height}
          x={stage.x}
          y={stage.y}
          onWheel={wheel}
          scaleX={stage.scale}
          scaleY={stage.scale}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          //   onTouchStart={handleTouchStart}
          //   onTouchMove={handleTouchMove}
          //   onTouchEnd={handleTouchEnd}
          //   onTouchCancel={handleTouchEnd}
          //   ref={stageRef}
        >
          <Layer>
            {image?.width && !isNaN(scaleFactor) ? (
              <Image
                image={image}
                // ref={imageRef}
                width={image.width * scaleFactor}
                height={image.height * scaleFactor}
              />
            ) : null}
            {console.log(rectangles)}
            {rectangles.map(
              (rect, index) =>
                rect.rectType == RECTANGLE_TYPE.ANNOTATION_LABEL && (
                  <Rectangle
                    key={rect.id}
                    shapeProps={rect}
                    isSelected={rect?.id === selectedRectId && isEditingRect}
                    fill={
                      // (hoveredId === rect.id && !isEditRect) ||
                      selectedRectId === rect.id && isEditingRect
                        ? `${rect.fill}4D`
                        : `transparent`
                    }
                    onChange={(newAttrs) => {
                      const rects = rectangles.slice();
                      rects[index] = newAttrs;
                      setRectangles(rects);
                    }}
                    // onMouseLeave={handleMouseLeave}
                    strokeWidth={stage.scale > 3 ? 0.25 : rect.strokeWidth}
                    selectedReactangleId={selectedRectId}
                    onClick={(e) => handleClickRectangle(e, rect.id)}
                  />
                )
            )}

            {imageStatus.drawing && (
              <Crosshair
                x={mousePosition.x}
                y={mousePosition.y}
                width={image.width * scaleFactor}
                height={image.height * scaleFactor}
              />
            )}
          </Layer>
        </Stage>
      </div>
    </div>
  );
}
