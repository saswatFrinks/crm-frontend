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

      console.log('cover', width, height);

      let scale = Math.min(width / image.width, height / image.height);
      console.log('Image: ', image.width, image.height);
      console.log('scale: ', scale);

      const originX = (canvasSize - image.width * scale) / 2;
      const originY = (canvasSize - image.height * scale) / 2;
      const cords = { x: originX, y: originY };
      console.log('Initial', cords);
      setOrigin({ ...cords, scale: scale });
      // console.log(cords)
      return cords;
    }
  };

  // const modifiedProps = shapeProps.map(prop => ({
  //   ...prop,
  //   x: prop.x*image.width,
  //   y: prop.y*image.height,
  //   width: prop.width*image.width,
  //   height: prop.height*image.height
  // }))

  useEffect(() => {
    resetGraph()
  }, [image])

  console.log({shapeProps})

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
              if((prop.threshold*100) > Number(threshold))return <></>
              return <React.Fragment>
                {prop?.title && <Text
                    x={(origin?.x || 0) + prop.x1 * image.width * origin?.scale}
                    y={(origin?.y || 0) + prop.y1 * image.height * origin?.scale - 17}
                    text={`${prop.id+1}. ${prop?.title}`}
                    fontSize={15}
                    fill={prop.stroke}
                />}

                <Rect
                  ref={shapeRef}
                  {...prop}
                  // fill={prop.stroke}
                  stroke={prop.stroke}
                  x={(origin?.x || 0) + prop.x1 * image.width * origin?.scale}
                  y={(origin?.y || 0) + prop.y1 * image.height * origin?.scale}
                  width={prop.width * image.width * origin?.scale}
                  height={prop.height * image.height * origin?.scale}
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
