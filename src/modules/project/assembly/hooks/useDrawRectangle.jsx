import { useRecoilState, useRecoilValue } from 'recoil';
import {
  currentRectangleIdAtom,
  currentRoiIdAtom,
  editingRectAtom,
  imageStatusAtom,
  mousePositionAtom,
  rectanglesAtom,
} from '../state';
import { getRandomHexColor } from '@/util/util';
import { BASE_RECT } from '@/core/constants';

export default function useDrawRectangle() {
  const [imageStatus, setImageStatus] = useRecoilState(imageStatusAtom);

  const [selectedRectId, setRectId] = useRecoilState(currentRectangleIdAtom);

  const [mousePosition, setMouseposition] = useRecoilState(mousePositionAtom);

  const [selectedRoiId, setCurrentRoiId] = useRecoilState(currentRoiIdAtom);

  const [rectangles, setRectangles] = useRecoilState(rectanglesAtom);

  const isEditing = useRecoilValue(editingRectAtom);

  const create = (e, createOne = true, imageId) => {
    console.log(imageId);
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
          roidId: selectedRoiId,
          x: stage.getRelativePointerPosition().x,
          y: stage.getRelativePointerPosition().y,
          fill: color,
          stroke: color,
          imageId,
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

        const updatedRectangles = [...rectangles];

        const rect = updatedRectangles.find((t) => t.id === selectedRectId);

        if (!rect) return;

        rect.width = stage.getRelativePointerPosition().x - (rect?.x ?? 0);
        rect.height = stage.getRelativePointerPosition().y - (rect?.y ?? 0);

        setRectangles(updatedRectangles);
      }
    }
  };

  return { draw, create };
}
