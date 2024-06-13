import React from 'react';
import { Circle, Line, Text } from 'react-konva';

const Polygon = ({
  shape,
  isSelected,
  onChange,
  onTransform,
  offset,
  scale,
  ...rest
}) => {
  console.log({shape})
  const shapeRef = React.useRef(null);

  const getNormalizedPoints = (arr) => {
    let points = [];
    let grouped = [];
    console.log(offset);
    const sc = scale || 1;
    const ox = offset?.x || 0;
    const oy = offset?.y || 0;
    for (let i = 0; i < arr?.length; i += 2) {
      const x = arr[i] * sc + ox;
      const y = arr[i + 1] * sc + oy;
      const xPoint = arr[i] + ox;
      const yPoint = arr[i + 1] + oy;
      console.log(x, y,"Grouped")
      points.push(x);
      points.push(y);
      grouped.push([x, y]);
      // grouped.push([xPoint, yPoint]);
      // console.log({points, grouped})
    }
    return [points, grouped];
  };

  // React.useEffect(() => {
    // const getNormalizedPoints = (arr) => {
    //   let points = [];
    //   let grouped = [];
    //   console.log(offset);
    //   const sc = scale || 1;
    //   const ox = offset?.x || 0;
    //   const oy = offset?.y || 0;
    //   for (let i = 0; i < arr?.length; i += 2) {
    //     const x = arr[i] * sc + ox;
    //     const y = arr[i + 1] * sc + oy;
    //     const xPoint = arr[i] + ox;
    //     const yPoint = arr[i + 1] + oy;
    //     console.log(x, y,"Grouped")
    //     points.push(x);
    //     points.push(y);
    //     grouped.push([x, y]);
    //     // grouped.push([xPoint, yPoint]);
    //     // console.log({points, grouped})
    //   }
    //   return [points, grouped];
    // };
    // const cb = () => {
    //   if (shapeRef.current) {
    //     const [pts] = getNormalizedPoints(shape.points);
    //     shapeRef.current.points(pts);
    //   }
    // };
    // console.log('changed', shape)
    // cb();
  // }, [shape, shapeRef, offset, scale]);
  // console.log(offset, scale)
  const [points, polyPoints] = getNormalizedPoints(shape.points);

  console.log('Polygon component rendered', {
    shape,
    isSelected,
    onChange,
    onTransform,
    offset,
    scale,
    ...rest,
  });

  return (
    <>
      {shape?.title && (
        <Text
          // x={(offset?.x || 0) + offset?.x * scale}
          // y={(offset?.y || 0) + offset?.y * scale }
          x={shape?.points[0] * scale + (offset?.x || 0)}
          y={shape.points[1] * scale + (offset?.y || 0) - 17}
          text={`${shape?.title}`}
          fontSize={15}
          fill={shape.fill}
        />
      )}
      <Line
        ref={shapeRef}
        {...shape}
        draggable={Boolean(isSelected)}
        onDragMove={(e) => {
          if (isSelected) e.cancelBubble = true;
        }}
        onDragStart={(e) => {
          if (isSelected) e.cancelBubble = true;
        }}
        onDragEnd={e=>{
          // console.log('ddfdfdfdfd',e.target.getAttrs())
          e.cancelBubble = true
          // e.evt.bubbles = false
          const newPoints = e.currentTarget.position();
          const sc = scale || 0
          const modifiedPoints = points.map((p,i)=> i%2==0 ? p+(newPoints.x * sc): p+newPoints.y* sc);
          console.log("MODS", modifiedPoints, newPoints, offset)
          onChange({uuid: shape.uuid, points: shapeRef.current.points()})
        }}
        stroke={isSelected ? '#505050' : shape.stroke}
        {...rest}
        points={points}
      />
      {isSelected &&
        polyPoints.map((vertex, i) => {
          return (
            <Circle
              key={i}
              radius={4}
              stroke={'#3a3a3a'}
              fill={`${shape.fill}3D`}
              x={vertex[0]}
              y={vertex[1]}
              strokeWidth={1}
              draggable={true}
              onMouseDown={(e) => (e.cancelBubble = true)}
              onMouseUp={(e) => (e.cancelBubble = true)}
              onDragMove={(e) => {
                console.log(e.evt.offsetX, e.evt.offsetY);
                console.log(vertex);
                const newPoints = [...points];
                newPoints[2 * i] = e.evt.offsetX;
                newPoints[2 * i + 1] = e.evt.offsetY;
                onTransform({ ...shape, points: newPoints });
              }}
            />
          );
        })}
    </>
  );
};

export default Polygon;



