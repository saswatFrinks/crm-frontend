import React from 'react';
import { Rect, Text, Transformer } from 'react-konva';

const Rectangle = ({
  shapeProps,
  isSelected,
  onChange,
  scale,
  offset,
  ...rest
}) => {
  const shapeRef = React.useRef();
  const trRef = React.useRef();
  React.useEffect(() => {
    if (isSelected) {
      // we need to attach transformer manually
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  const effectiveScale = scale || 1;

  React.useEffect(()=>{
    if(shapeRef?.current){
      shapeRef.current.x((offset?.x || 0) + shapeProps.x * effectiveScale);
      shapeRef.current.y((offset?.y || 0) + shapeProps.y * effectiveScale);
      shapeRef.current.width(shapeProps.width * effectiveScale);
      shapeRef.current.height(shapeProps.height * effectiveScale);
    }
  }, [shapeProps, shapeRef])
  // console.log("title: ",shapeProps.title)

  return (
    <React.Fragment>
        {shapeProps?.title && <Text
            x={(offset?.x || 0) + shapeProps.x * effectiveScale}
            y={(offset?.y || 0) + shapeProps.y * effectiveScale - 17}
            text={`${shapeProps?.title}`}
            fontSize={15}
            fill={shapeProps.fill}
        />}

      <Rect
        ref={shapeRef}
        {...shapeProps}
        x={(offset?.x || 0) + shapeProps.x * effectiveScale}
        y={(offset?.y || 0) + shapeProps.y * effectiveScale}
        width={shapeProps.width * effectiveScale}
        height={shapeProps.height * effectiveScale}
        draggable={Boolean(isSelected)}
        onDragMove={(e)=>{
          if(isSelected) e.cancelBubble=true;
        }}
        onDragStart={e=>{
          if(isSelected) e.cancelBubble=true;
        }}
        
        onDragEnd={(e) => {
            console.log('drag end');
          onChange({
            ...shapeProps,
            width: e.target.width(),
            height: e.target.height(),
            x: e.target.x(),
            y: e.target.y(),
          });
        }}
        onMouseUp={e=>isSelected && (e.cancelBubble=true)}
        onMouseDown={e=>{
            e.evt.stopPropagation()
            if(isSelected) e.cancelBubble=true;
            console.log("starting dragging of rectangle here:",e.clientX)
        }}
        onTransformEnd={() => {
          const node = shapeRef.current;
          const scaleX = node.scaleX();
          const scaleY = node.scaleY();

        //   // we will reset it back
          node.scaleX(1);
          node.scaleY(1);
        console.log('transform end')
        console.log(scaleX, scaleY, effectiveScale);
        console.log(node.width(), node.height(), shapeProps.width, shapeProps.height)

          onChange({
            ...shapeProps,
            x: node.x(),
            y: node.y(),
            width: node.width() * scaleX,
            height: node.height() *  scaleY,
          });
        }}
        {...rest}
      />
      {isSelected && (
        <Transformer
          ref={trRef}
          onMouseDown={e=>e.cancelBubble=true}
          onMouseMove={e=>e.cancelBubble=true}
          onMouseUp={e=>e.cancelBubble=true}
          boundBoxFunc={(oldBox, newBox) => {
            // limit resize
            if (newBox.width < 5 || newBox.height < 5) {
              return oldBox;
            }
            return newBox;
          }}
          keepRatio={false}
        />
      )}
    </React.Fragment>
  );
};

export default Rectangle;
