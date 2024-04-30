import { useRecoilState, useRecoilValue } from 'recoil';

import { getRandomHexColor } from '@/util/util';
import { BASE_RECT, RECTANGLE_TYPE } from '@/core/constants';
import { editingRectAtom } from '../state';
import {
  currentRectangleIdAtom,
  currentRoiIdAtom,
  imageStatusAtom,
  mousePositionAtom,
  rectanglesAtom,
} from '../../state';

export default function useDrawRectangle(rectType = RECTANGLE_TYPE.ROI) {
  const [imageStatus, setImageStatus] = useRecoilState(imageStatusAtom);

  const [selectedRectId, setRectId] = useRecoilState(currentRectangleIdAtom);

  const [mousePosition, setMouseposition] = useRecoilState(mousePositionAtom);

  const [selectedRoiId, setCurrentRoiId] = useRecoilState(currentRoiIdAtom);

  const [rectangles, setRectangles] = useRecoilState(rectanglesAtom);

  const isEditing = useRecoilValue(editingRectAtom);

  const create = (e, createOne = true, imageId) => {
    if (imageStatus.drawing && !selectedRectId) {
      const stage = e.target.getStage();

      const color = getRandomHexColor();

      let id = Date.now();

      console.log(
        stage.getRelativePointerPosition().x,
        stage.getRelativePointerPosition().y
      );

      setRectId(id);

      setRectangles((rs) => {
        const rects = createOne ? [] : rs.slice();

        rects.push({
          ...BASE_RECT,
          id,
          roiId: selectedRoiId,
          x: stage.getRelativePointerPosition().x,
          y: stage.getRelativePointerPosition().y,
          fill: color,
          stroke: color,
          imageId,
          rectType: rectType,
        });

        return [...rects];
      });
    }
  };

  const draw = (e, imageId) => {
    if (imageStatus.drawing) {
      const stage = e.target.getStage();

      const pointerPosition = stage.getRelativePointerPosition();

      setMouseposition(pointerPosition);

      if (selectedRectId && !isEditing) {
        // setHoveredId(null);

        setRectangles((t) =>
          t.map((k) => ({
            ...k,
            width:
              k.id == selectedRectId
                ? stage.getRelativePointerPosition().x - (k?.x ?? 0)
                : k.width,
            height:
              k.id == selectedRectId
                ? stage.getRelativePointerPosition().y - (k?.y ?? 0)
                : k.height,
          }))
        );
      }
    }
  };

  return { draw, create };
}
