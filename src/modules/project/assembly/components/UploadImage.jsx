import { useContainerSize } from '@/shared/hooks/useContainerSize';
import { useMouseWheel } from '@/modules/project/assembly/hooks/useMouseWheel';
import BigImage from '@/shared/icons/BigImage';
import Upload from '@/shared/icons/Upload';
import React from 'react';
import { Stage, Layer, Image, Text, Line as LineShape } from 'react-konva';
import useImage from 'use-image';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { dragAtom, imageStatusAtom, stageAtom } from '../states';

export default function UploadImage() {
  const [file, setFile] = React.useState(null);
  const stage = useRecoilValue(stageAtom);
  const { wheel } = useMouseWheel({});

  const setStage = useSetRecoilState(stageAtom);

  const [imageStatus, setImageStatus] = useRecoilState(imageStatusAtom);

  const [dragPosition, setDragPosition] = useRecoilState(dragAtom);

  const containerRef = React.useRef(null);

  const [image] = useImage(file);

  const { size, scaleFactor } = useContainerSize({
    containerRef,
    image,
  });

  const handleChangeFile = (e) => {
    const file = e.target.files[0];

    if (!file) return;
    const url = URL.createObjectURL(file);
    setFile(url);
  };

  const handleMouseUp = (e) => {
    console.log('up');
    setImageStatus((t) => ({
      ...t,
      dragging: false,
    }));
  };

  const handleMouseDown = (e) => {
    console.log('down');

    if (!imageStatus.dragging && imageStatus.drag) {
      setImageStatus((t) => ({ ...t, dragging: true }));
      setDragPosition({ x: e.evt.clientX, y: e.evt.clientY });
    }
  };

  const handleMouseMove = (e) => {
    if (imageStatus.dragging && imageStatus.drag) {
      const dx = e.evt.clientX - dragPosition.x;
      const dy = e.evt.clientY - dragPosition.y;

      setStage((stage) => ({ ...stage, x: stage.x + dx, y: stage.y + dy }));
      setDragPosition({ x: e.evt.clientX, y: e.evt.clientY });
    }
  };

  if (!file) {
    return (
      <>
        <BigImage />
        <label className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-f-primary px-20 py-2 text-white duration-100 hover:bg-f-secondary">
          <Upload /> Upload master image
          <input type="file" hidden onChange={handleChangeFile} />
        </label>
      </>
    );
  } else {
    return (
      <div
        className="flex h-full w-full flex-col"
        ref={containerRef}
        style={{
          width: ((window.innerWidth - 16 * 4) * 7) / 12,
          // height: (window.innerHeight * 11) / 12,
        }}
      >
        <div
          className={`grow-[1] overflow-auto ${imageStatus.draw ? 'cursor-crosshair' : ''}`}
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
              {image && (
                <Image
                  image={image}
                  // ref={imageRef}
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
}
