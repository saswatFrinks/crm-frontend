import { useContainerSize } from '@/shared/hooks/useContainerSize';
import { useMouseWheel } from '@/modules/project/assembly/hooks/useMouseWheel';
import BigImage from '@/shared/icons/BigImage';
import Upload from '@/shared/icons/Upload';
import React from 'react';
import { Stage, Layer, Image, Text, Line as LineShape } from 'react-konva';
import useImage from 'use-image';
import { useRecoilValue } from 'recoil';
import { stageAtom } from '../states';

export default function UploadImage() {
  const [file, setFile] = React.useState(null);
  const stage = useRecoilValue(stageAtom);
  const { wheel } = useMouseWheel({});

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
        id="container1"
        style={{
          width: window.innerWidth - 580,
        }}
      >
        <Stage
          width={size.width}
          height={size.height}
          x={stage.x}
          y={stage.y}
          onWheel={wheel}
          scaleX={stage.scale}
          scaleY={stage.scale}
          //   onMouseDown={handleMouseDown}
          //   onMouseUp={handleMouseUp}
          //   onMouseMove={handleMouseMove}
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
    );
  }
}
