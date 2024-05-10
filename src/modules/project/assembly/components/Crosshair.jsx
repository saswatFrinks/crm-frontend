import { Line } from 'react-konva';

function Crosshair({ x, y, width, height, offset }) {
  const actualOffset = offset || {x: 0, y: 0}
  return (
    <>
      {/* Horizontal Line */}
      <Line points={[actualOffset.x, actualOffset.y+y, actualOffset.x+width, actualOffset.y+y]} stroke="green" strokeWidth={1} />
      {/* Vertical Line */}
      <Line points={[actualOffset.x+x, actualOffset.y, actualOffset.x+x, actualOffset.y+height]} stroke="green" strokeWidth={1} />
    </>
  );
}

export default Crosshair;
