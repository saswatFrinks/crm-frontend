import { useContainerSize } from '@/shared/hooks/useContainerSize';
import { useMouseWheel } from '@/modules/project/assembly/hooks/useMouseWheel';
import BigImage from '@/shared/icons/BigImage';
import Upload from '@/shared/icons/Upload';
import React from 'react';
import { Stage, Layer, Image, Text, Line as LineShape } from 'react-konva';
import useImage from 'use-image';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import {
  currentRectangleIdAtom,
  dragAtom,
  editingAtom,
  imageStatusAtom,
  mousePositionAtom,
  rectanglesAtom,
  selectedFileAtom,
  selectedRoiSelector,
  stageAtom,
  uploadedFileListAtom,
} from '../../state';
import Crosshair from './Crosshair';
import useDrawRectangle from '../hooks/useDrawRectangle';
import Rectangle from './Rectangle';
import { v4 as uuidv4 } from 'uuid';
import ImageList from '../label-image-step/ImageList';
import { editingRectAtom, stepAtom } from '../state';
import { RECTANGLE_TYPE } from '@/core/constants';

export default function UploadImage() {
  const [file, setFile] = React.useState(null);

  const { wheel } = useMouseWheel({});

  const drawRectHook = useDrawRectangle();

  const stage = useRecoilValue(stageAtom);

  const setStage = useSetRecoilState(stageAtom);

  const [imageStatus, setImageStatus] = useRecoilState(imageStatusAtom);

  const [dragPosition, setDragPosition] = useRecoilState(dragAtom);

  const [mousePosition, setMouseposition] = useRecoilState(mousePositionAtom);

  const [selectedRectId, setSelectedRectId] = useRecoilState(
    currentRectangleIdAtom
  );

  const [rectangles, setRectangles] = useRecoilState(rectanglesAtom);

  const [isEditing, setIsEditing] = useRecoilState(editingAtom);

  const [isEditingRect, setEditingRect] = useRecoilState(editingRectAtom);

  const step = useRecoilValue(stepAtom);

  const [images, setUploadedFileList] = useRecoilState(uploadedFileListAtom);

  const selectedFile = useRecoilValue(selectedFileAtom);

  const selectedRectangles = useRecoilValue(
    selectedRoiSelector(selectedFile?.id)
  );

  const containerRef = React.useRef(null);

  const [image] = useImage(file);

  const { size, scaleFactor } = useContainerSize({
    containerRef,
    image,
  });

  const handleChangeFile = (e) => {
    if (step == 0) {
      const files = Array.from(e.target.files).map((t) => ({
        id: uuidv4(),
        fileName: t.name,
        url: URL.createObjectURL(t),
        checked: false,
      }));

      setUploadedFileList(files);
    }
  };

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

  const handleMouseLeave = () => {};

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
        width: ((window.innerWidth - 16 * 4) * 7) / 12,
      }}
    >
      {step == 0 ? (
        <>
          <BigImage />
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-f-primary px-20 py-2 text-white duration-100 hover:bg-f-secondary">
            <Upload /> Upload master image
            <input type="file" hidden onChange={handleChangeFile} multiple />
          </label>
        </>
      ) : null}

      {file &&
      [1, 2, 3].includes(step) &&
      image?.width &&
      !isNaN(scaleFactor) ? (
        <>
          <ImageList />

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
                <Image
                  image={image}
                  // ref={imageRef}
                  width={image.width * scaleFactor}
                  height={image.height * scaleFactor}
                />
                {rectangles.map(
                  (rect, index) =>
                  <>
                    {rect.rectType == RECTANGLE_TYPE.ROI && (
                      <Rectangle
                        key={rect.id}
                        shapeProps={rect}
                        isSelected={
                          rect?.id === selectedRectId &&
                          isEditingRect &&
                          isEditing
                        }
                        fill={
                          // (hoveredId === rect.id && !isEditRect) ||
                          selectedRectId === rect.id &&
                          isEditingRect &&
                          isEditing
                            ? `${rect.fill}4D`
                            : `transparent`
                        }
                        onChange={(newAttrs) => {
                          const rects = rectangles.slice();
                          rects[index] = newAttrs;
                          setRectangles(rects);
                        }}
                        onMouseLeave={handleMouseLeave}
                        strokeWidth={stage.scale > 3 ? 0.25 : rect.strokeWidth}
                        selectedReactangleId={selectedRectId}
                        onClick={(e) => handleClickRectangle(e, rect.id)}
                      />
                    )}
                  </>
                )}
                {rectangles.map((rect, i) => {
                  if (rect.rectType !== RECTANGLE_TYPE.ROI) return null;
                  return (
                    <Text
                      key={`text-${rect.id}`}
                      x={rect.x}
                      y={(rect.y ?? 0) - (rect.width <= 40 ? 8 : 12)}
                      text={rect.roiId}
                      fill={rect.fill}
                      fontSize={rect.width <= 40 ? 8 : 12}
                      align="left"
                      width={rect.width < 40 ? 100 : rect.width}
                    />
                  );
                })}

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
        </>
      ) : null}
    </div>
  );
}
