import React from 'react';
import { Circle, Line, Text } from 'react-konva';
import PolyVertice from './PolyVertice';

const movementThreshold = 100;

const checkThresholdViolation = (points, evt, posIndex) => {
  return (
    Math.abs(points[posIndex] - evt.offsetX) > movementThreshold ||
    Math.abs(points[posIndex + 1] - evt.offsetY) > movementThreshold
  );
};

const Polygon = ({
  shape,
  isSelected,
  onChange,
  onTransform,
  offset,
  scale,
  freeze = false,
  ...rest
}) => {
  const shapeRef = React.useRef(null);

  const getNormalizedPoints = (arr) => {
    let points = [];
    let grouped = [];
    const sc = scale || 1;
    const ox = offset?.x || 0;
    const oy = offset?.y || 0;
    for (let i = 0; i < arr?.length; i += 2) {
      const x = arr[i] * sc + ox;
      const y = arr[i + 1] * sc + oy;
      points.push(x);
      points.push(y);
      grouped.push([x, y]);
      // grouped.push([xPoint, yPoint]);
    }
    return [points, grouped];
  };

  const [vertexes, groupedPoints] = getNormalizedPoints(shape.points);

  const [polyPoints, setPolyPoints] = React.useState(groupedPoints);
  const [points, setPoints] = React.useState(vertexes);

  React.useEffect(() => {
    const getNormalizedPoints = (arr) => {
      let points = [];
      let grouped = [];
      const sc = scale || 1;
      const ox = offset?.x || 0;
      const oy = offset?.y || 0;
      for (let i = 0; i < arr?.length; i += 2) {
        const x = arr[i] * sc + ox;
        const y = arr[i + 1] * sc + oy;
        points.push(x);
        points.push(y);
        grouped.push([x, y]);
      }
      return [points, grouped];
    };
    const cb = () => {
      if (shapeRef.current) {
        const [pts, grouped] = getNormalizedPoints(shape.points);
        setPolyPoints(grouped);
        setPoints(pts);
        shapeRef.current.points(pts);
        shapeRef.current.x(0);
        shapeRef.current.y(0);
      }
    };
    cb();
  }, [shape, shapeRef, offset, scale]);

  const sc = scale || 1

  console.log(polyPoints, 'vertexes') 

  return (
    <>
      {!freeze && shape?.title && shape?.points.length && (
        <Text
          // x={(offset?.x || 0) + offset?.x * scale}
          // y={(offset?.y || 0) + offset?.y * scale }
          x={shape.points[0] * sc + (offset?.x || 0)}
          y={shape.points[1] * sc + (offset?.y || 0) - 17}
          text={`${shape?.title}`}
          fontSize={15}
          fill={shape.fill}
          fontStyle="bold"
        />
      )}
      <Line
        ref={shapeRef}
        {...shape}
        draggable={Boolean(isSelected)}
        onMouseDown={(e) => isSelected && (e.cancelBubble = true)}
        onMouseUp={(e) => isSelected && (e.cancelBubble = true)}
        onDragMove={(e) => {
          if (isSelected) {
            e.cancelBubble = true;
            const xDrag = e.currentTarget.x();
            const yDrag = e.currentTarget.y();
            const res = [];
            for (let i = 0; i < points.length; i += 2) {
              res.push([points[i] + xDrag, points[i + 1] + yDrag]);
            }
            setPolyPoints(res);
          }
        }}
        onDragStart={(e) => {
          if (isSelected) e.cancelBubble = true;
        }}
        onDragEnd={(e) => {
          if (isSelected) {
            e.cancelBubble = true;
            // e.evt.bubbles = false
            const xDrag = e.currentTarget.x();
            const yDrag = e.currentTarget.y();
            const modifiedPoints = points.map((p, i) =>
              i % 2 == 0 ? p + xDrag : p + yDrag
            );
            onChange({ uuid: shape.uuid, points: modifiedPoints });
          }
        }}
        stroke={isSelected ? '#505050' : shape.stroke}
        {...rest}
        points={points}
        x={0}
        y={0}
        strokeWidth={2}
      />
      {isSelected &&
        polyPoints.map((vertex, i) => {
          return (
            <PolyVertice
              key={i}
              radius={6}
              stroke={'#02CCFE'}
              fill={`#f1f1f13D`}
              vertex={vertex}
              strokeWidth={3}
              draggable={true}
              onMouseDown={(e) => (e.cancelBubble = true)}
              onMouseUp={(e) => (e.cancelBubble = true)}
              onDragMove={(e) => {
                if (freeze) {
                  e.cancelBubble = true;
                  return;
                }
                const newPoints = [...points];
                const posIndex = 2 * i;

                const threshViolation = checkThresholdViolation(
                  newPoints,
                  e.evt,
                  posIndex
                );
                if (threshViolation) {
                  setPoints(newPoints);
                  return;
                }
                newPoints[posIndex] = e.evt.offsetX;
                newPoints[posIndex + 1] = e.evt.offsetY;
                // console.log('evt move', e)
                setPoints(newPoints);
              }}
              onDragEnd={(e) => {
                // if (freeze) {
                //   e.cancelBubble = true;
                //   return;
                // }
                e.cancelBubble = true
                const newPoints = [...points];
                const posIndex = 2 * i;

                const threshViolation = checkThresholdViolation(
                  newPoints,
                  e.evt,
                  posIndex
                );
                if (threshViolation) {
                  onTransform({ ...shape, points: newPoints });
                  return;
                }
                newPoints[posIndex] = e.evt.offsetX;
                newPoints[posIndex + 1] = e.evt.offsetY;
                // setPoints(newPoints);
                // console.log('evt', e);
                onTransform({ ...shape, points: newPoints });
              }}
            />
          );
        })}
    </>
  );
};

export default Polygon;
