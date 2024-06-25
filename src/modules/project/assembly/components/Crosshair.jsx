import { Line } from 'react-konva';

function Crosshair({ x, y, canvasSize }) {
  return (
    <>
      {/* Horizontal Line */}
      <Line points={[x, 0, x, canvasSize]} stroke="green" strokeWidth={1} />
      {/* Vertical Line */}
      <Line points={[0, y, canvasSize, y]} stroke="green" strokeWidth={1} />
    </>
  );
}

export default Crosshair;
