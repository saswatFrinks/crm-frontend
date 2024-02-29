import { SCALE_RANGE } from '@/core/constants';
import { useSetRecoilState } from 'recoil';
import { stageAtom } from '../../state';

export const useMouseWheel = ({ isEditing }) => {
  const setStage = useSetRecoilState(stageAtom);

  const wheel = (e) => {
    if (!isEditing) return;
    e.evt.preventDefault();

    const scaleBy = 1.1;
    const stage = e.target.getStage();
    const oldScale = stage.scaleX();
    const mousePointTo = {
      x: stage.getPointerPosition().x / oldScale - stage.x() / oldScale,
      y: stage.getPointerPosition().y / oldScale - stage.y() / oldScale,
    };

    let newScale = e.evt.deltaY < 0 ? oldScale * scaleBy : oldScale / scaleBy;

    if (newScale < SCALE_RANGE.MIN) {
      newScale = SCALE_RANGE.MIN;
    }
    if (newScale > SCALE_RANGE.MAX) {
      newScale = SCALE_RANGE.MAX;
    }

    setStage({
      scale: newScale,
      x: (stage.getPointerPosition().x / newScale - mousePointTo.x) * newScale,
      y: (stage.getPointerPosition().y / newScale - mousePointTo.y) * newScale,
    });
  };

  return {
    wheel,
  };
};
