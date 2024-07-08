import React, { useEffect, useState } from 'react';
import { Stage, Rect, Layer, Transformer, Image, Circle, Line } from 'react-konva';
import Rectangle from './Rectangle';
import Crosshair from './Crosshair';
import { ACTION_NAMES, BASE_RECT, RECTANGLE_TYPE } from '@/core/constants';
import { getAverageBrightness, getRandomHexColor } from '@/util/util';
import { useRecoilState, useRecoilValue } from 'recoil';
import {
  currentPolygonIdAtom,
  currentRectangleIdAtom,
  currentRoiIdAtom,
  editingAtom,
  imageStatusAtom,
  labelClassAtom,
  lastActionNameAtom,
  polygonsAtom,
  polygonsTypeAtom,
  rectanglesTypeAtom,
} from '../../state';
import { rectangleColorAtom, stepAtom } from '../state';
import { v4 } from 'uuid';
import Polygon from './Polygon';
import { cropLine, snapPolygonToBoundary } from '@/util/geometry';

const KonvaImageView = ({
  image,
  onDrawStop,
  rectangles,
  title = null,
  imageId,
  polygons,
  onPolyUpdate,
  polyDraw,
}) => {
  const coverRef = React.useRef(null);
  const canvasRef = React.useRef(null);
  const stageRef = React.useRef(null);

  const [imageStatus, setImageStatus] = useRecoilState(imageStatusAtom);
  const isEditing = useRecoilValue(editingAtom);

  const [rectangleColor, setRectangleColor] =
    useRecoilState(rectangleColorAtom);

  const canvaSize = 5000;

  // const [scale, setScale] = React.useState(1);
  const [origin, setOrigin] = React.useState({ x: 0, y: 0, scale: 1 });

  // const [action, setAction] = useRecoilState({
  //   isDragging: false,
  //   drawing: false,
  //   drawMode: false,
  // });
  const [rectStart, setRectStart] = React.useState({ x: 0, y: 0 });
  const [dragStart, setDragStart] = React.useState({ x: 0, y: 0 });
  // const [selectedPolyId, setSelectedPloyId] = useRecoilState(
  //   currentRectangleIdAtom
  // );
  const [selectedRectId, setSelectedRectId] = useRecoilState(
    currentRectangleIdAtom
  );
  const [selectedPolyId, setSelectedPolyId] =
    useRecoilState(currentPolygonIdAtom);
  const [currentPoly, setCurrentPoly] = React.useState(null);
  const roiId = useRecoilValue(currentRoiIdAtom);
  const rectangleType = useRecoilValue(rectanglesTypeAtom);
  const polygonType = useRecoilValue(polygonsTypeAtom);
  const step = useRecoilValue(stepAtom);

  const [lastPolyId, setLastPolyId] = React.useState(null);
  const [lastAction, setLastAction] = useRecoilState(lastActionNameAtom);
  const [scaledRectangles, setScaledRectangles] = useState([]);
  const [scaledPolygons, setScaledPolygons] = useState([]);

  const [curPoly, setCurPoly] = React.useState(null);

  console.log({rectStart})

  const handleScroll = (evt) => {
    const e = evt.evt;
    e.preventDefault();
    const layerCanvas = canvasRef.current.getCanvas()._canvas;
    layerCanvas.getContext('2d').imageSmoothingEnabled = false;

    const stage = coverRef.current;
    const { width, height } = stage.getBoundingClientRect();

    const mouseX = e.clientX - stage.offsetLeft + (canvaSize - width) / 2;
    const mouseY = e.clientY - stage.offsetTop + (canvaSize - height) / 2;

    const wheel = e.deltaY < 0 ? 1.1 : 1 / 1.1;
    const newScale = Math.min(10, Math.max(0.2, origin.scale * wheel));
    const originX = mouseX - (mouseX - origin.x) * (newScale / origin.scale);
    const originY = mouseY - (mouseY - origin.y) * (newScale / origin.scale);
    const cords = { x: originX, y: originY };
    setOrigin({ ...cords, scale: newScale });
  };
  console.log({drawMode: imageStatus.drawMode})

  const handleMouseDown = (evt) => {
    const e = evt.evt;

    const stage2 = evt.target.getStage();
    const pointerPosition = stage2.getPointerPosition();

    const stage = coverRef.current;
    

    if (imageStatus.drawMode === 'POLY' || imageStatus.drawMode === 'RECT') {
      //called when rectangle is drawn
      if (imageStatus.drawMode === 'POLY') {

        const newPoints = currentPoly?.points?.concat([
          pointerPosition.x,
          pointerPosition.y,
        ]);

        const uuid = v4();
        const id =
          1 + step == 1
            ? polygons?.filter((ele) => ele.polyType == RECTANGLE_TYPE.ROI)
                .length || 0
            : polygons?.filter(
                (ele) =>
                  ele.polyType == RECTANGLE_TYPE.ANNOTATION_LABEL &&
                  ele.imageId == imageId
              ).length || 0;
        

        // const color = getRandomHexColor();
        const color =
          rectangleColor.selectedColor === '#fff' || polygonType === RECTANGLE_TYPE.ROI
            ? getRandomHexColor()
            : rectangleColor.selectedColor;
        setCurrentPoly({
          ...BASE_RECT,
          // ...polygonPoints,
          id,
          fill: color,
          stroke: color,
          imageId: imageId,
          polyType: polygonType,
          roiId,
          title,
          uuid,
          points: newPoints,
        });

        // const newPoints = currentPoly?.points?.concat([
        //   pointerPosition.x,
        //   pointerPosition.y,
        // ]);
        // setCurrentPoly((prev) => ({ ...prev, points: newPoints}));

        setImageStatus((p) => ({ ...p, drawMode: 'POLY' }));
        setLastPolyId(uuid);
        // } else if(imageStatus.drawMode === "RECT"){
      } else {
        setImageStatus((a) => ({ ...a, drawing: true, drawMode: 'RECT' }));
        const poly = {
          x: pointerPosition.x,
          y: pointerPosition.y,
        };

        setRectStart(poly);
        const color =
          rectangleColor.selectedColor === '#fff' || rectangleType === 'ROI'
            ? getRandomHexColor()
            : rectangleColor.selectedColor;
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
          // ...polygonPoints,
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
      }
    } else {
      // called when image is dragged
      setImageStatus((a) => ({ ...a, dragging: true }));
      setDragStart({
        x: e.clientX - stage.offsetLeft - origin.x,
        y: e.clientY - stage.offsetTop - origin.y,
      });
    }
  };

  React.useEffect(() => {
    if (imageStatus.drawMode !== 'POLY' || !polyDraw) return;
    const color = getRandomHexColor();
    // const color =
    //       rectangleColor.selectedColor === '#fff' || polygonType === 'ROI'
    //         ? getRandomHexColor()
    //         : rectangleColor.selectedColor;
    const id =
      1 + step == 1
        ? polygons?.filter((ele) => ele.polyType == RECTANGLE_TYPE.ROI)
            .length || 0
        : polygons?.filter(
            (ele) =>
              ele.polyType == RECTANGLE_TYPE.ANNOTATION_LABEL &&
              ele.imageId == imageId
          ).length || 0;
    const uuid = v4();
    const poly = {
      id,
      points: [],
      fill: color,
      stroke: color,
      strokeWidth: 0.5,
      imageId: imageId,
      polyType: polygonType,
      roiId,
      title,
      uuid,
    };
    setCurrentPoly(poly);
    setImageStatus((p) => ({ ...p, drawMode: 'POLY' }));
  }, [polyDraw, imageStatus.drawMode]);


  const normalizePolygonPoints = (arr) => {
    return arr.map((pt, i) => {
      if (i % 2 == 0) {
        return (pt - origin.x) / origin.scale / image.width;
      }
      return (pt - origin.y) / origin.scale / image.width;
    });

    // return {
    //   x: (x - origin.x) / origin.scale / image.width,
    //   y: (y - origin.y) / origin.scale / image.height,
    //   width: width / origin.scale / image.width,
    //   height: height / origin.scale / image.height,
    // };
  };

  

  const handleMouseMove = (evt) => {
    const e = evt.evt;

    const stage = coverRef.current;
    const { width, height } = stage.getBoundingClientRect();

    if (
      imageStatus.drawing &&
      (imageStatus.drawMode === 'POLY' || imageStatus.drawMode === 'RECT')
    ) {
      const stage2 = evt.target.getStage();
      const pointerPosition = stage2.getPointerPosition();

      const currentX = pointerPosition.x;
      const currentY = pointerPosition.y;
      setCurrentPoly((prev) => ({
        ...prev,
        width: currentX - rectStart.x,
        height: currentY - rectStart.y,
      }));
    } else if (imageStatus.dragging) {
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
    // const updateObj = { dragging: false };
    console.log('mouse up')
    if (imageStatus.drawing) {
      const normalizedValue = {
        action: 'RECTANGLE',
        ...currentPoly,
        ...normalizeDimensions({ ...currentPoly }),
      };
      handleValueReset(normalizedValue);
      if (normalizedValue.width !== 0 && normalizedValue.height !== 0) {
        onDrawStop([...rectangles, normalizedValue]);
      }
      setCurrentPoly(null);
      // updateObj['drawMode'] = false;
      // updateObj['drawing'] = false;
      if(normalizedValue.uuid){
        setSelectedRectId(normalizedValue.uuid);
      }
    } else {
      // setSelectedRectId(null);
    }
    // setImageStatus((a) => ({ ...a, ...updateObj }));
    console.log(imageStatus)
    setImageStatus((prev) => ({
      ...prev,
      // draw: false,
      dragging: false,
      drawing: false,
      drawMode:
        prev.drawMode === 'RECT' || prev.drawMode === 'POLY'
          ? true
          : prev.drawMode,
    }));
  };

  useEffect(() => {
    resetGraph();
  }, []);

  const resetGraph = (newScale = null) => {
    if (image?.height && canvasRef?.current) {

      const cover = coverRef.current;
      const { width, height } = cover.getBoundingClientRect();

      let scale =
        newScale ?? Math.min(width / image.width, height / image.height);

      const originX = (canvaSize - image.width * scale) / 2;
      const originY = (canvaSize - image.height * scale) / 2;
      const cords = { x: originX, y: originY };
      setOrigin({ ...cords, scale: scale });
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

  const cropPolygonPoints = (polyPoints) => {
    const imageBoundaryX = 1;
    const imageBoundaryY = 1;

    let snappedPoints = snapPolygonToBoundary(polyPoints, imageBoundaryX, imageBoundaryY);
    console.log(snappedPoints);

    const totalPoints = snappedPoints.length;
    for(let i = 0; i<totalPoints; i+=2){
      const x1 = snappedPoints[i];
      const y1 = snappedPoints[i+1];

      const x2 = snappedPoints[(i+2) % totalPoints];
      const y2 = snappedPoints[(i+3) % totalPoints];

      const changedPoints = cropLine({x1, x2, y1, y2, boundaryX: imageBoundaryX, boundaryY: imageBoundaryY});
      console.log(changedPoints)
      if(changedPoints==null){
        for(let j = 0; j<3; j++) snappedPoints[i+j] =null;
      }
      else {
        snappedPoints[i] = changedPoints.x1;
        snappedPoints[i+1] = changedPoints.y1;
        snappedPoints[(i+2)% totalPoints] = changedPoints.x2;
        snappedPoints[(i+3) % totalPoints] = changedPoints.y2;
      }
      console.log("iterating", i, snappedPoints)
    }
    const result = snappedPoints.filter(ele=>ele!==null);

    if(result.length < 6) throw new Error();
    
    return result;
  }

  const handleDoubleClick = (e) => {
    
    if (imageStatus.drawMode === 'POLY' && currentPoly?.points?.length > 2) {
      const pos = stageRef.current.getPointerPosition();
      const poly = { ...currentPoly, closed: true };
      poly.points = normalizePolygonPoints(poly.points);
      try{
        poly.points = cropPolygonPoints(poly.points);
        onPolyUpdate([...polygons, poly]);
        setSelectedPolyId(currentPoly.uuid);
      }
      catch(e){}
    }
    setCurrentPoly(null);
    setImageStatus((prev) => ({
      ...prev,
      // draw: false,
      dragging: false,
      drawing: false,
      drawMode: true,
    }));
  };

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
    // setImageStatus((p) => ({
    //   ...p,
    //   drawMode: imageStatus.drawMode,
    //   dragging: imageStatus.dragging,
    // }));
    if (imageStatus.oneToOne) {
      resetGraph(1);
      setImageStatus((p) => ({ ...p, oneToOne: false }));
    }
    if (imageStatus.fitToCenter) {
      //   resetGraph(origin.scale);
      resetGraph();
      setImageStatus((p) => ({ ...p, fitToCenter: false }));
    }
  }, [imageStatus]);

  React.useEffect(() => {
    const deleteCallback = (evt) => {
      if (evt.key == 'Delete' && step == 1) {
        let spId = null;
        setSelectedRectId((selectedRectId) => {
          if (selectedRectId) {
            spId = selectedRectId;
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
      rectangles.forEach((rect) => {
        const x = rect.x * image.width;
        const y = rect.y * image.height;
        const width = rect.width * image.width;
        const height = rect.height * image.height;
        modified.push({ ...rect, x, y, width, height });
      });
    }
    setScaledRectangles(modified);
  }, [rectangles, image?.width]);

  useEffect(() => {
    const modified = [];
    if (image?.width) {
      polygons?.forEach((poly) => {
        const points = poly?.points?.map((point) => point * image.width);
        modified.push({ ...poly, points });
      });
    }
    setScaledPolygons(modified);
  }, [polygons, image?.width]);

  React.useEffect(() => {
    if (lastAction && lastAction !== ACTION_NAMES.SELECTED) {
      if (lastAction == ACTION_NAMES.CANCEL) {
        onDrawStop(rectangles?.filter((r) => r.uuid !== lastPolyId));
        onPolyUpdate(polygons?.filter((r) => r.uuid !== lastPolyId));
      }

      setLastPolyId(null);
      setLastAction(null);
    }
  }, [lastAction]);
  console.log({rectStart, currentPoly})

  //to put the selected rectangle on top to select it
  React.useEffect(() => {
    if(selectedRectId){
      const selectedRect = scaledRectangles.find(rect => rect.uuid === selectedRectId);
      const remainingRects = scaledRectangles.filter(rect => rect.uuid !== selectedRectId);
      if(selectedRect){
        setScaledRectangles([...remainingRects, selectedRect]);
      }
    }
  }, [selectedRectId])

  //to put the selected polygon on top to select it
  React.useEffect(() => {
    if(selectedPolyId){
      const selectedPoly = scaledPolygons.find(poly => poly.uuid === selectedPolyId);
      const remainingPolys = scaledPolygons.filter(poly => poly.uuid !== selectedPolyId);
      if(selectedPoly){
        setScaledPolygons([...remainingPolys, selectedPoly]);
      }
    }
  }, [selectedPolyId])

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
        onMouseLeave={(e) => e.preventDefault()}
        onDblClick={handleDoubleClick}
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
              return (
                <Rectangle
                  key={`rect_${rect.rectType}_${rect.uuid}`}
                  id={`rect_${rect.id}`}
                  shapeProps={rect}
                  offset={origin}
                  scale={origin.scale}
                  isSelected={rect.uuid == selectedRectId}
                  onChange={(e) => {
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
                    selectedRectId === rect.uuid
                      ? `${rect.fill}4D`
                      : `transparent`
                  }
                  strokeWidth={origin.scale > 3 ? 0.25 : rect.strokeWidth}
                  onClick={(e) => {
                    if (rect.uuid == selectedRectId) e.cancelBubble = true;
                    // handleClickRectangle(e, rect.uuid);
                  }}
                />
              );
            })}
          {currentPoly?.x && (
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
          {imageStatus.drawing && currentPoly?.x && (
            <>
              <Crosshair
                x={currentPoly.x}
                y={currentPoly.y}
                canvasSize={canvaSize}
              />
              <Crosshair
                x={currentPoly.x+currentPoly.width}
                y={currentPoly.y+currentPoly.height}
                canvasSize={canvaSize}
              />
            </>
          )}

          {scaledPolygons
            .filter(
              (e) =>
                e.polyType == RECTANGLE_TYPE.ROI ||
                ([2, 3].includes(step) && e.imageId === imageId)
            )
            ?.map((poly, i) => {
              return (
                <Polygon
                  key={i}
                  shape={poly}
                  isSelected={selectedPolyId === poly.uuid}
                  onChange={(e) => {
                    const unchanged = polygons.filter(
                      (ele) => ele.uuid !== poly.uuid
                    );
                    const index = polygons.findIndex((r) => r.uuid == e.uuid);
                    if (index >= 0) {
                      let buf = normalizePolygonPoints(e.points)
                      try{
                        buf = cropPolygonPoints(buf)
                        const normalizedValue = {
                          ...polygons[index],
                          // ...normalizeDimensions(e),
                          points: buf
                        };
                        // handleValueReset(normalizedValue);
                        onPolyUpdate([...unchanged, normalizedValue]);
                      }
                      catch(e){
                        onPolyUpdate([...polygons]);
                      }
                      // const ref = e.target.attrs
                    }
                  }}
                  offset={origin}
                  scale={origin.scale}
                  fill={
                    selectedPolyId == poly.uuid
                      ? `${poly.fill}4D`
                      : `transparent`
                  }
                  onTransform={(res) => {
                    const polyCp = [...polygons];
                    try{
                      let points = normalizePolygonPoints(res.points);
                      points = cropPolygonPoints(points);
                      polyCp[i] = { ...res, points };
                    }
                    catch(e){
                      polyCp[i] = { ...res, points: [...(polyCp[i].points)] };
                    }
                    onPolyUpdate(polyCp);
                  }}
                  onClick={(e) => {
                    if (poly.uuid == selectedPolyId) e.cancelBubble = true;
                  }}
                />
              );
            })}
          {currentPoly?.points && (
            <Polygon
              shape={currentPoly}
              isSelected={true}
              onChange={() => {}}
              // scale={origin.scale}
              // offset={{x: 0, y: 0}}
            />
          )}
        </Layer>
      </Stage>
    </div>
  );
};

export default KonvaImageView;
