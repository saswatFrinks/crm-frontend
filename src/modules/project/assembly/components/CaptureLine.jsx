import React, { useRef, useState } from "react";
import { Line, Rect, Transformer } from "react-konva";
import { useRecoilValue } from "recoil";
import { captureAtom } from "../state";
import { assemblyAtom } from "../../state";

const CaptureLine = ({offset, scale, width, height, isSelected}) => {
  const trRef = useRef()
  const lineRef = useRef();

  const position = useRecoilValue(captureAtom);
  const configuration = useRecoilValue(assemblyAtom);

  const isHorizontal = [1,2].includes(Number(configuration.productFlow)) ? true : false;

  React.useEffect(() => {
    if (isSelected) {
      trRef.current.nodes([lineRef.current]);
      trRef.current.getLayer().batchDraw();
    }else{
      trRef.current.nodes([]);
    }
  }, [isSelected]);

  const x = isHorizontal ? position : 0;
  const y = isHorizontal ? 0 : position;

  return (
    <>
      <Rect 
        ref={lineRef}
        x={(x * scale * width) + offset.x}
        y={(y * scale * height) + offset.y}
        width={isHorizontal ? 1 : width*scale}
        height={isHorizontal ? height*scale : 1}
        stroke="#22C55E" 
        strokeWidth={1} 
        rotation={0}
      />
      <Transformer
        ref={trRef}
        onMouseDown={(e) => (e.cancelBubble = true)}
        onMouseMove={(e) => (e.cancelBubble = true)}
        onMouseUp={(e) => (e.cancelBubble = true)}
        resizeEnabled={false}
        rotateEnabled={false}
        keepRatio={false}
        borderStroke="yellow"
      />
    </>
  )
}

export default CaptureLine;