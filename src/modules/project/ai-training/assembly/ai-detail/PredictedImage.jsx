import React, { useEffect, useState } from 'react'
import { Image, Layer, Rect, Stage, Text } from 'react-konva'
import useImage from 'use-image'

const PredictedImage = ({canvasSize, shapeProps, url, threshold}) => {
  const [image] = useImage(url);
  const [origin, setOrigin] = useState({});
  const coverRef = React.useRef(null);
  const shapeRef = React.useRef(null);

  const resetGraph = () => {
    if (image?.height) {

      const cover = coverRef.current;
      const { width, height } = cover.getBoundingClientRect();

      let scale = Math.min(width / image.width, height / image.height);

      const originX = (canvasSize - image.width * scale) / 2;
      const originY = (canvasSize - image.height * scale) / 2;
      const cords = { x: originX, y: originY };
      setOrigin({ ...cords, scale: scale });
      return cords;
    }
  };

  useEffect(() => {
    resetGraph()
  }, [image])

  if(!image?.width)return <></> 

  return (
    <div 
      ref={coverRef}
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        overflowY: 'hidden',
      }}
    >
      <div
        style={{overflow: 'hidden'}}
      >
        <Stage
          width={canvasSize}
          height={canvasSize}
        >
          <Layer>
            <Image
              image={image}
              width={image?.width * origin?.scale}
              height={image?.height * origin?.scale}
              x={origin?.x}
              y={origin?.y}
            />
            {shapeProps.map(prop => {
              const [x, y, width, height] = prop.coordinates;
              const x1 = x - width/2;
              const y1 = y - height/2;
              if((prop.threshold) < Number(threshold))return <></>
              return <React.Fragment
                key={`${prop.id}`}
              >
                {prop?.title && <Text
                    x={(origin?.x || 0) + x1 * image.width * origin?.scale}
                    y={(origin?.y || 0) + y1 * image.height * origin?.scale - 17}
                    text={`${prop.id+1}. ${prop?.title}`}
                    fontSize={15}
                    fill={prop.stroke}
                />}

                <Rect
                  ref={shapeRef}
                  {...prop}
                  // fill={prop.stroke}
                  stroke={prop.stroke}
                  x={(origin?.x || 0) + x1 * image.width * origin?.scale}
                  y={(origin?.y || 0) + y1 * image.height * origin?.scale}
                  width={width * image.width * origin?.scale}
                  height={height * image.height * origin?.scale}
                />
              </React.Fragment>
            })}
          </Layer>
        </Stage>
      </div>
    </div>
  )
}

export default PredictedImage
