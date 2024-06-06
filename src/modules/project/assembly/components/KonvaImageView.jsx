import React, { useEffect, useState } from 'react';
import { Stage, Rect, Layer, Transformer, Image } from 'react-konva';
import Rectangle from './Rectangle';
import Crosshair from './Crosshair';
import { ACTION_NAMES, BASE_RECT, RECTANGLE_TYPE } from '@/core/constants';
import { getRandomHexColor } from '@/util/util';
import { useRecoilState, useRecoilValue } from 'recoil';
import {
  currentRectangleIdAtom,
  currentRoiIdAtom,
  editingAtom,
  imageStatusAtom,
  labelClassAtom,
  lastActionNameAtom,
  rectanglesTypeAtom,
} from '../../state';
import { rectangleColorAtom, stepAtom } from '../state';
import { v4 } from 'uuid';

const KonvaImageView = ({
  image,
  onDrawStop,
  rectangles,
  title = null,
  imageId,
}) => {
  console.log(rectangles);
  const coverRef = React.useRef(null);
  const canvasRef = React.useRef(null);
  const stageRef = React.useRef(null);

  const [IMAGE_STATUS, setImageStatus] = useRecoilState(imageStatusAtom);
  const isEditing = useRecoilValue(editingAtom);

  const [rectangleColor, setRectangleColor] = useRecoilState(rectangleColorAtom);
  console.log({rectangleColor});
  

  const canvaSize = 5000;

  // const [scale, setScale] = React.useState(1);
  const [origin, setOrigin] = React.useState({ x: 0, y: 0, scale: 1 });

  const [action, setAction] = React.useState({
    isDragging: false,
    drawing: false,
    drawMode: false,
  });
  const [rectStart, setRectStart] = React.useState({ x: 0, y: 0 });
  const [dragStart, setDragStart] = React.useState({ x: 0, y: 0 });
  const [selectedPolyId, setSelectedPloyId] = useRecoilState(
    currentRectangleIdAtom
  );
  const [currentPoly, setCurrentPoly] = React.useState(null);
  const roiId = useRecoilValue(currentRoiIdAtom);
  const rectangleType = useRecoilValue(rectanglesTypeAtom);
  const step = useRecoilValue(stepAtom);

  const [lastPolyId, setLastPolyId] = React.useState(null);
  const [lastAction, setLastAction] = useRecoilState(lastActionNameAtom);
  const [scaledRectangles, setScaledRectangles] = useState([]);

  const handleScroll = (evt) => {
    const e = evt.evt;
    e.preventDefault();
    const layerCanvas = canvasRef.current.getCanvas()._canvas;
    layerCanvas.getContext('2d').imageSmoothingEnabled = false;

    const stage = coverRef.current;
    const { width, height } = stage.getBoundingClientRect();
    console.log(width, height, stage.offsetLeft, stage.offsetTop);

    const mouseX = e.clientX - stage.offsetLeft + (canvaSize - width) / 2;
    const mouseY = e.clientY - stage.offsetTop + (canvaSize - height) / 2;

    const wheel = e.deltaY < 0 ? 1.1 : 1 / 1.1;
    const newScale = Math.min(10, Math.max(0.2, origin.scale * wheel));
    console.log(e.clientX, e.clientY);
    console.log(mouseX - origin.x, mouseY - origin.y);
    const originX = mouseX - (mouseX - origin.x) * (newScale / origin.scale);
    const originY = mouseY - (mouseY - origin.y) * (newScale / origin.scale);
    console.log(newScale / origin.scale);
    const cords = { x: originX, y: originY };
    setOrigin({ ...cords, scale: newScale });
  };

  const handleMouseDown = (evt) => {
    const e = evt.evt;

    const stage2 = evt.target.getStage();
    const pointerPosition = stage2.getPointerPosition();

    const stage = coverRef.current;
    

    if (action.drawMode) {
      setAction((a) => ({ ...a, drawing: true }));
      const poly = {
        x: pointerPosition.x,
        y: pointerPosition.y,
      };
      setRectStart(poly);
      const color = rectangleColor.selectedColor === "#fff" || rectangleType === 'ROI' ? getRandomHexColor() : rectangleColor.selectedColor;
      const id =
        1 + step == 1
          ? rectangles?.filter((ele) => ele.rectType == RECTANGLE_TYPE.ROI)
              .length || 0
          : rectangles?.filter(
              (ele) =>
                ele.rectType == RECTANGLE_TYPE.ANNOTATION_LABEL &&
                ele.imageId == imageId
            ).length || 0;
      const uuid = v4();
      setCurrentPoly({
        ...BASE_RECT,
        ...poly,
        id,
        fill: color,
        stroke: color,
        imageId: imageId,
        rectType: rectangleType,
        roiId,
        title,
        uuid,
      });

      
      setLastPolyId(uuid);
    } else {
      console.log('starting dragging here:', e.clientX);
      setAction((a) => ({ ...a, isDragging: true }));
      setDragStart({
        x: e.clientX - stage.offsetLeft - origin.x,
        y: e.clientY - stage.offsetTop - origin.y,
      });
    }
  };

  const handleMouseMove = (evt) => {
    const e = evt.evt;

    const stage = coverRef.current;
    const { width, height } = stage.getBoundingClientRect();

    // console.log(stage, stage.offsetLeft)
    if (action.drawing && action.drawMode) {
      const stage2 = evt.target.getStage();
      const pointerPosition = stage2.getPointerPosition();

      const currentX = pointerPosition.x;
      const currentY = pointerPosition.y;
      setCurrentPoly((prev) => ({
        ...prev,
        width: currentX - rectStart.x,
        height: currentY - rectStart.y,
      }));
    } else if (action.isDragging) {
      //originX is the new 0,0 of image.
      const originX = e.clientX - stage.offsetLeft - dragStart.x;
      const originY = e.clientY - stage.offsetTop - dragStart.y;
      const cords = { x: originX, y: originY };
      setOrigin((prev) => ({ ...cords, scale: prev.scale }));
    }
  };

  const normalizeDimensions = ({ x, y, width, height }) => {
    return {
      x: (x - origin.x) / origin.scale / image.width,
      y: (y - origin.y) / origin.scale / image.height,
      width: width / origin.scale / image.width,
      height: height / origin.scale / image.height,
    };
  };

  const handleMouseUp = () => {
    const updateObj = { isDragging: false };
    if (action.drawing) {
      const normalizedValue = {
        action: 'RECTANGLE',
        ...currentPoly,
        ...normalizeDimensions({ ...currentPoly }),
      };
      handleValueReset(normalizedValue);
      console.log(normalizedValue);
      if (normalizedValue.width !== 0 && normalizedValue.height !== 0) {
        onDrawStop([...rectangles, normalizedValue]);
      }
      setCurrentPoly(null);
      updateObj['drawMode'] = false;
      updateObj['drawing'] = false;
      setSelectedPloyId(normalizedValue.uuid);
    } else {
      setSelectedPloyId(null);
    }
    setAction((a) => ({ ...a, ...updateObj }));
    setImageStatus((prev) => ({
      ...prev,
      draw: false,
      dragging: false,
      drawing: false,
    }));
  };

  useEffect(() => {
    resetGraph();
  }, []);

  const resetGraph = (newScale = null) => {
    if (image?.height && canvasRef?.current) {
      console.log(canvasRef.current);

      const cover = coverRef.current;
      const { width, height } = cover.getBoundingClientRect();
      console.log('cover', width, height);

      let scale =
        newScale ?? Math.min(width / image.width, height / image.height);
      console.log('Image: ', image.width, image.height);
      console.log('scale: ', scale);

      const originX = (canvaSize - image.width * scale) / 2;
      const originY = (canvaSize - image.height * scale) / 2;
      const cords = { x: originX, y: originY };
      console.log('Initial', cords);
      setOrigin({ ...cords, scale: scale });
      // console.log(cords)
      return cords;
    }
  };

  // const handleClickRectangle = (e, id) => {
  //     const rect = rectangles.find(ele=>ele.id==id)
  //     if ( rect
  //         && (step==1)
  //         && id == e.target.attrs.id
  //         && rect.rectType==RECTANGLE_TYPE.ROI
  //     ){
  //     //   setEditingRect(true);
  //       setSelectedPloyId(id);
  //       if(rect){
  //           onDrawStop([...rectangles.filter(ele=>ele.id!==id), rect]);
  //       }
  //     }
  // };

  const handleValueReset = (rectObj) => {
    const imageBoundaryX = 1;
    const imageBoundaryY = 1;

    //!if x and y are beyond the boundary, move them back to the image, snap to boundary
    //right and bottom boundary
    if (rectObj.x > imageBoundaryX || rectObj.y > imageBoundaryY) {
      rectObj.x =
        rectObj.x + rectObj.width > imageBoundaryX
          ? imageBoundaryX - Math.abs(rectObj.width)
          : rectObj.x;

      rectObj.y =
        rectObj.y + rectObj.height > imageBoundaryY
          ? imageBoundaryY - Math.abs(rectObj.height)
          : rectObj.y;
    }

    //left and top boundary
    if (rectObj.x + rectObj.width < 0 || rectObj.y + rectObj.height < 0) {
      rectObj.x = rectObj.x < 0 ? 0 : rectObj.x;

      rectObj.y = rectObj.y < 0 ? 0 : rectObj.y;
    }

    //!flipped rectangle conditions, move x to left top, also y to left top
    if (rectObj.width < 0) {
      rectObj.x += rectObj.width;
      rectObj.width = -rectObj.width;
    }
    if (rectObj.height < 0) {
      rectObj.y += rectObj.height;
      rectObj.height = -rectObj.height;
    }

    //!If all aboce conditions fail, crop the rectangle
    //crop the rectangle when axis less than 0
    if (rectObj.x < 0) {
      rectObj.width += rectObj.x;
      rectObj.x = 0;
    }
    if (rectObj.y < 0) {
      rectObj.height += rectObj.y;
      rectObj.y = 0;
    }

    //crop the rectangle when axis greater than image size
    if (rectObj.x + rectObj.width > imageBoundaryX) {
      rectObj.width = imageBoundaryX - rectObj.x;
    }
    if (rectObj.y + rectObj.height > imageBoundaryY) {
      rectObj.height = imageBoundaryY - rectObj.y;
    }
  };

  React.useEffect(() => {
    resetGraph();
  }, [image, canvasRef]);

  React.useEffect(() => {
    setAction((p) => ({
      ...p,
      drawMode: IMAGE_STATUS.draw,
      isDragging: IMAGE_STATUS.dragging,
    }));
    if (IMAGE_STATUS.oneToOne) {
      resetGraph(1);
      setImageStatus((p) => ({ ...p, oneToOne: false }));
    }
    if (IMAGE_STATUS.fitToCenter) {
      //   resetGraph(origin.scale);
      resetGraph();
      setImageStatus((p) => ({ ...p, fitToCenter: false }));
    }
  }, [IMAGE_STATUS]);

  React.useEffect(() => {
    const deleteCallback = (evt) => {
      if (evt.key == 'Delete' && step == 1) {
        let spId = null;
        setSelectedPloyId((selectedPolyId) => {
          if (selectedPolyId) {
            spId = selectedPolyId;
          }
          return null;
        });
        if (spId) onDrawStop(rectangles.filter((rect) => rect.uuid !== spId));
        handleMouseUp();
      }
    };
    window.addEventListener('keyup', deleteCallback);
    return () => window.removeEventListener('keyup', deleteCallback);
  }, [rectangles]);

  React.useEffect(() => {
    const modified = [];
    if (image?.width) {
      console.log()
      rectangles.forEach((rect) => {
        const x = rect.x * image.width;
        const y = rect.y * image.height;
        const width = rect.width * image.width;
        const height = rect.height * image.height;
        modified.push({ ...rect, x, y, width, height });
      });
    }
    console.log("modiifed",modified);
    setScaledRectangles(modified);
  }, [rectangles, image?.width]);

  React.useEffect(() => {
    if (lastAction && lastAction !== ACTION_NAMES.SELECTED) {
      if (lastAction == ACTION_NAMES.CANCEL) {
        onDrawStop(rectangles.filter((r) => r.uuid !== lastPolyId));
      }

      setLastPolyId(null);
      setLastAction(null);
    }
  }, [lastAction]);

  

  return (
    <div
      ref={coverRef}
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
      }}
    >
      <Stage
        width={canvaSize}
        height={canvaSize}
        onWheel={handleScroll}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        ref={stageRef}
      >
        <Layer ref={canvasRef}>
          <Image
            image={image}
            width={image.width * origin.scale}
            height={image.height * origin.scale}
            x={origin.x}
            y={origin.y}
          />
          {scaledRectangles
            .filter(
              (e) =>
                e.rectType == RECTANGLE_TYPE.ROI ||
                ([2, 3].includes(step) && e.imageId == imageId)
            )
            ?.map((rect, i) => {
              // console.log('rendering', i, origin)
              return (
                <Rectangle
                  key={`rect_${rect.rectType}_${rect.uuid}`}
                  id={`rect_${rect.id}`}
                  shapeProps={rect}
                  offset={origin}
                  scale={origin.scale}
                  isSelected={rect.uuid == selectedPolyId}
                  onChange={(e) => {
                    console.log(e);
                    const unchanged = rectangles.filter(
                      (ele) => ele.uuid !== rect.uuid
                    );
                    const index = rectangles.findIndex((r) => r.uuid == e.uuid);
                    if (index >= 0) {
                      const normalizedValue = {
                        ...e,
                        ...normalizeDimensions(e),
                      };
                      handleValueReset(normalizedValue);
                      onDrawStop([...unchanged, normalizedValue]);
                    } else onDrawStop(unchanged);
                  }}
                  fill={
                    // (hoveredId === rect.uuid && !isEditRect) ||
                    selectedPolyId === rect.uuid
                      ? `${rect.fill}4D`
                      : `transparent`
                  }
                  strokeWidth={origin.scale > 3 ? 0.25 : rect.strokeWidth}
                  onClick={(e) => {
                    if (rect.uuid == selectedPolyId) e.cancelBubble = true;
                    // handleClickRectangle(e, rect.uuid);
                  }}
                />
              );
            })}
          {currentPoly && (
            <Rectangle
              key={`rect_drawing_${currentPoly.id}`}
              shapeProps={currentPoly}
              isSelected={false}
              onChange={(e) => {
                setCurrentPoly((prev) => ({ ...prev, ...e }));
              }}
              fill={`${currentPoly.fill}4D`}
              id={`drawing_rect_${currentPoly.id}`}
            />
          )}
          {action.drawing && (
            <>
              <Crosshair
                x={rectStart.x * origin.scale - origin.x}
                y={rectStart.y * origin.scale - origin.y}
                width={image.width * origin.scale}
                height={image.height * origin.scale}
                offset={origin}
              />
              <Crosshair
                x={
                  (currentPoly.x + currentPoly.width) * origin.scale - origin.x
                }
                y={
                  (currentPoly.y + currentPoly.height) * origin.scale - origin.y
                }
                width={image.width * origin.scale}
                height={image.height * origin.scale}
                offset={origin}
              />
            </>
          )}
        </Layer>
      </Stage>
    </div>
  );
};

export default KonvaImageView;
