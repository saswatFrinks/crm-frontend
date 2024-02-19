import { Line } from 'react-konva';

function Crosshair({ x, y, width, height }) {
  return (
    <>
      {/* Horizontal Line */}
      <Line points={[0, y, width, y]} stroke="black" strokeWidth={0.25} />
      {/* Vertical Line */}
      <Line points={[x, 0, x, height]} stroke="black" strokeWidth={0.25} />
    </>
  );
}

export default Crosshair;
