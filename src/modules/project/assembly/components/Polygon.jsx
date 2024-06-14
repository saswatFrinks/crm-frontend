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
      const xPoint = arr[i] + ox;
      const yPoint = arr[i + 1] + oy;
      points.push(x);
      points.push(y);
      grouped.push([x, y]);
      // grouped.push([xPoint, yPoint]);
    }
    return [points, grouped];
  };

  const [vertexes, groupedPoints] = getNormalizedPoints(shape.points);

  const [polyPoints, setPolyPoints] = React.useState(groupedPoints);
  const [points, setPoints] = React.useState(vertexes)

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
        const xPoint = arr[i] + ox;
        const yPoint = arr[i + 1] + oy;
        points.push(x);
        points.push(y);
        grouped.push([x, y]);
      }
      return [points, grouped];
    };
    const cb = () => {
      if (shapeRef.current) {
        const [pts, grouped] = getNormalizedPoints(shape.points);
        setPolyPoints(grouped)
        setPoints(pts)
        shapeRef.current.points(pts);
        shapeRef.current.x(0);
        shapeRef.current.y(0);
      }
    };
    cb();
  }, [shape, shapeRef, offset, scale]);

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
        onMouseDown={(e) => isSelected && (e.cancelBubble = true)}
        onMouseUp={(e) => isSelected && (e.cancelBubble = true)}
        onDragMove={(e) => {
          if (isSelected){
            e.cancelBubble = true;
            const xDrag = e.currentTarget.x();
            const yDrag = e.currentTarget.y();
            const res = []
            for(let i = 0; i< points.length; i+=2){
              res.push([points[i]+xDrag, points[i+1]+yDrag])
            }
            setPolyPoints(res);
          }
        }}
        onDragStart={(e) => {
          if (isSelected) e.cancelBubble = true;
        }}
        onDragEnd={e=>{
          if(isSelected){
            e.cancelBubble = true
            // e.evt.bubbles = false
            const xDrag = e.currentTarget.x();
            const yDrag = e.currentTarget.y();
            const modifiedPoints = points.map((p,i)=> i%2==0 ? p+xDrag : p+yDrag);
            onChange({uuid: shape.uuid, points: modifiedPoints})
          }
        }}
        stroke={isSelected ? '#505050' : shape.stroke}
        {...rest}
        points={points}
        x={0}
        y={0}
      />
      {isSelected &&
        polyPoints.map((vertex, i) => {
          return (
            <Circle
              key={i}
              radius={6}
              stroke={'#02CCFE'}
              fill={`#f1f1f13D`}
              x={vertex[0]}
              y={vertex[1]}
              strokeWidth={2}
              draggable={true}
              onMouseDown={(e) => (e.cancelBubble = true)}
              onMouseUp={(e) => (e.cancelBubble = true)}
              onDragMove={(e)=>{
                const newPoints = [...points];
                newPoints[2 * i] = e.evt.offsetX;
                newPoints[2 * i + 1] = e.evt.offsetY;
                setPoints(newPoints);
              }}
              onDragEnd={(e) => {
                const newPoints = [...points];
                newPoints[2 * i] = e.evt.offsetX;
                newPoints[2 * i + 1] = e.evt.offsetY;
                // setPoints(newPoints);
                onTransform({ ...shape, points: newPoints });
              }}
            />
          );
        })}
    </>
  );
};

export default Polygon;



